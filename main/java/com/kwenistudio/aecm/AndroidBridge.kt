package com.kwenistudio.aecm

import android.app.Activity
import android.webkit.JavascriptInterface

/**
 * Exposé au jeu sous `window.AndroidBridge`. Le contrat (noms et signatures)
 * est celui documenté dans app.js, sections "COUCHE DE MONÉTISATION" et
 * "CLASSEMENTS" : ne pas renommer ces méthodes.
 *
 * Les @JavascriptInterface sont appelées sur un thread de fond : tout ce qui
 * touche aux SDK Google repasse sur le thread UI.
 */
class AndroidBridge(
    private val activity: Activity,
    private val ads: AdsManager,
    private val billing: BillingManager,
    private val games: PlayGamesManager,
) {
    private fun ui(block: () -> Unit) = activity.runOnUiThread(block)

    // ── Publicités récompensées ──────────────────────────────────────────
    @JavascriptInterface fun watchAd(placement: String) = ui { ads.show(placement) }
    @JavascriptInterface fun isAdReady(): Boolean = ads.isReady()

    // ── Achats Google Play ───────────────────────────────────────────────
    @JavascriptInterface fun purchase(sku: String) = ui { billing.purchase(sku) }
    @JavascriptInterface fun confirmDelivery(token: String) = ui { billing.confirmDelivery(token) }
    @JavascriptInterface fun restore() = ui { billing.restore() }

    // ── Classements Play Games ───────────────────────────────────────────
    @JavascriptInterface fun signIn() = ui { games.signIn() }
    @JavascriptInterface fun isSignedIn(): Boolean = games.signedIn
    @JavascriptInterface fun submitScore(leaderboardId: String, score: Double) = ui { games.submitScore(leaderboardId, score.toLong()) }
    @JavascriptInterface fun showLeaderboard(leaderboardId: String) = ui { games.showLeaderboard(leaderboardId) }

    // ── Consentement RGPD (à relier à un bouton "Confidentialité" dans le jeu) ─
    @JavascriptInterface fun isPrivacyOptionsRequired(): Boolean = ads.privacyOptionsRequired()
    @JavascriptInterface fun showPrivacyOptions() = ui { ads.showPrivacyOptions() }
}
