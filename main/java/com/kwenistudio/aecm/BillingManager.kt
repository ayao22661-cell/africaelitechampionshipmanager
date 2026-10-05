package com.kwenistudio.aecm

import android.app.Activity
import android.widget.Toast
import com.android.billingclient.api.AcknowledgePurchaseParams
import com.android.billingclient.api.BillingClient
import com.android.billingclient.api.BillingClient.BillingResponseCode
import com.android.billingclient.api.BillingClient.ProductType
import com.android.billingclient.api.BillingClientStateListener
import com.android.billingclient.api.BillingFlowParams
import com.android.billingclient.api.BillingResult
import com.android.billingclient.api.ConsumeParams
import com.android.billingclient.api.PendingPurchasesParams
import com.android.billingclient.api.ProductDetails
import com.android.billingclient.api.Purchase
import com.android.billingclient.api.PurchasesUpdatedListener
import com.android.billingclient.api.QueryProductDetailsParams
import com.android.billingclient.api.QueryPurchasesParams

/**
 * Google Play Billing, en suivant la "RÈGLE D'ORDRE" documentée dans app.js :
 * un achat n'est JAMAIS acquitté/consommé ici tant que le jeu n'a pas appelé
 * confirmDelivery(token) — c'est-à-dire après livraison ET sauvegarde réussies.
 * Si l'app meurt entre les deux, Play représente l'achat au prochain restore().
 */
class BillingManager(
    private val activity: Activity,
    private val js: (String, String, Array<out Any?>) -> Unit,
) : PurchasesUpdatedListener {

    companion object {
        // Doivent exister À L'IDENTIQUE dans la Play Console (voir IAP_CATALOG dans app.js).
        val CONSUMABLES = setOf(
            "credits_small", "credits_medium", "credits_large",
            "gems_small", "gems_medium", "gems_large",
            "pack_bronze", "pack_argent", "pack_or",
            "flash_daily",
        )
        val NON_CONSUMABLES = setOf("premium", "season_pass", "welcome_bundle")
        val SUBSCRIPTIONS = setOf("vip_monthly")
    }

    private val client = BillingClient.newBuilder(activity)
        .setListener(this)
        .enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build())
        .enableAutoServiceReconnection()
        .build()

    private var ready = false
    private val whenReady = mutableListOf<() -> Unit>()
    private val details = mutableMapOf<String, ProductDetails>()

    /** Achats livrés au jeu mais pas encore confirmés, indexés par le jeton transmis au JS. */
    private val awaitingDelivery = mutableMapOf<String, Purchase>()

    /** SKU de l'achat lancé par Monet.purchase(), qui attend onPurchase. */
    private var pendingSku: String? = null

    private fun callMonet(method: String, vararg args: Any?) = js("Monet", method, args)

    fun start() {
        client.startConnection(object : BillingClientStateListener {
            override fun onBillingSetupFinished(result: BillingResult) {
                activity.runOnUiThread {
                    if (result.responseCode != BillingResponseCode.OK) return@runOnUiThread
                    ready = true
                    queryDetails(ProductType.INAPP, CONSUMABLES + NON_CONSUMABLES)
                    queryDetails(ProductType.SUBS, SUBSCRIPTIONS)
                    whenReady.forEach { it() }
                    whenReady.clear()
                }
            }

            override fun onBillingServiceDisconnected() {
                // enableAutoServiceReconnection() se charge de reconnecter.
            }
        })
    }

    fun stop() = client.endConnection()

    private fun queryDetails(type: String, ids: Set<String>) {
        val params = QueryProductDetailsParams.newBuilder()
            .setProductList(ids.map {
                QueryProductDetailsParams.Product.newBuilder().setProductId(it).setProductType(type).build()
            })
            .build()
        client.queryProductDetailsAsync(params) { result, list ->
            if (result.responseCode == BillingResponseCode.OK) {
                activity.runOnUiThread { list.productDetailsList.forEach { details[it.productId] = it } }
            }
        }
    }

    // ── Achat ────────────────────────────────────────────────────────────
    fun purchase(sku: String) {
        // Le jeu bloque tous ses boutons d'achat en attendant onPurchase : il
        // faut TOUJOURS répondre, même quand la boutique n'est pas joignable.
        val pd = details[sku]
        if (!ready || pd == null) {
            toast(R.string.billing_unavailable)
            callMonet("onPurchase", sku, false, null)
            return
        }
        val productParams = BillingFlowParams.ProductDetailsParams.newBuilder().setProductDetails(pd)
        if (pd.productType == ProductType.SUBS) {
            val offer = pd.subscriptionOfferDetails?.firstOrNull()
            if (offer == null) {
                callMonet("onPurchase", sku, false, null)
                return
            }
            productParams.setOfferToken(offer.offerToken)
        }
        pendingSku = sku
        val flow = BillingFlowParams.newBuilder().setProductDetailsParamsList(listOf(productParams.build())).build()
        val result = client.launchBillingFlow(activity, flow)
        if (result.responseCode != BillingResponseCode.OK) failPending()
    }

    override fun onPurchasesUpdated(result: BillingResult, purchases: MutableList<Purchase>?) {
        activity.runOnUiThread {
            when (result.responseCode) {
                BillingResponseCode.OK -> purchases.orEmpty().forEach { handle(it, fromFlow = true) }
                BillingResponseCode.ITEM_ALREADY_OWNED -> restore()
            }
            // Tout ce qui n'a pas abouti à un achat payé (annulation, erreur,
            // paiement en attente…) libère le jeu avec un échec.
            failPending()
        }
    }

    private fun failPending() {
        val sku = pendingSku ?: return
        pendingSku = null
        callMonet("onPurchase", sku, false, null)
    }

    private fun handle(purchase: Purchase, fromFlow: Boolean) {
        val sku = purchase.products.firstOrNull() ?: return
        if (purchase.purchaseState != Purchase.PurchaseState.PURCHASED) {
            if (purchase.purchaseState == Purchase.PurchaseState.PENDING && fromFlow) toast(R.string.purchase_pending)
            return
        }
        // Abonnement : le purchaseToken reste le même à chaque renouvellement,
        // mais l'orderId change (…..0, …..1) — c'est lui qui permet au jeu de
        // livrer chaque mois une seule fois (déduplication par jeton dans grantIAP).
        val token = if (sku in SUBSCRIPTIONS) purchase.orderId ?: purchase.purchaseToken else purchase.purchaseToken
        awaitingDelivery[token] = purchase
        if (fromFlow && sku == pendingSku) {
            pendingSku = null
            callMonet("onPurchase", sku, true, token)
        } else {
            callMonet("onRestoredPurchase", sku, token)
        }
    }

    /** Appelé par le jeu APRÈS livraison et sauvegarde : on peut enfin acquitter/consommer. */
    fun confirmDelivery(token: String) {
        val purchase = awaitingDelivery.remove(token) ?: return
        val sku = purchase.products.firstOrNull() ?: return
        if (sku in CONSUMABLES) {
            client.consumeAsync(ConsumeParams.newBuilder().setPurchaseToken(purchase.purchaseToken).build()) { _, _ -> }
        } else if (!purchase.isAcknowledged) {
            client.acknowledgePurchase(
                AcknowledgePurchaseParams.newBuilder().setPurchaseToken(purchase.purchaseToken).build()
            ) { }
        }
    }

    // ── Restauration ─────────────────────────────────────────────────────
    /**
     * Représente au jeu tous les achats encore valables : consommables pas
     * encore consommés (livraison interrompue), achats définitifs (utile après
     * réinstallation — grantIAP est idempotent) et abonnements actifs.
     */
    fun restore() {
        if (!ready) {
            whenReady += { restore() }
            return
        }
        listOf(ProductType.INAPP, ProductType.SUBS).forEach { type ->
            client.queryPurchasesAsync(QueryPurchasesParams.newBuilder().setProductType(type).build()) { result, list ->
                if (result.responseCode == BillingResponseCode.OK) {
                    activity.runOnUiThread { list.forEach { handle(it, fromFlow = false) } }
                }
            }
        }
    }

    private fun toast(res: Int) = Toast.makeText(activity, res, Toast.LENGTH_LONG).show()
}
