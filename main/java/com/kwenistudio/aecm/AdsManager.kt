package com.kwenistudio.aecm

import android.app.Activity
import android.os.Handler
import android.os.Looper
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.ads.rewarded.RewardedAd
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback
import com.google.android.ump.ConsentInformation
import com.google.android.ump.ConsentRequestParameters
import com.google.android.ump.UserMessagingPlatform
import java.util.concurrent.atomic.AtomicBoolean

/**
 * Pubs récompensées AdMob, précédées du formulaire de consentement (UMP),
 * obligatoire pour les joueurs de l'EEE / Royaume-Uni.
 * Rappelle le jeu via Monet.onAdReward / Monet.onAdFailed.
 */
class AdsManager(
    private val activity: Activity,
    private val js: (String, String, Array<out Any?>) -> Unit,
) {
    private val consent: ConsentInformation = UserMessagingPlatform.getConsentInformation(activity)
    private val initialized = AtomicBoolean(false)
    private val handler = Handler(Looper.getMainLooper())

    @Volatile private var rewarded: RewardedAd? = null
    private var loading = false
    private var retryDelayMs = 5_000L

    private fun callMonet(method: String, vararg args: Any?) = js("Monet", method, args)

    fun start() {
        consent.requestConsentInfoUpdate(
            activity,
            ConsentRequestParameters.Builder().build(),
            { UserMessagingPlatform.loadAndShowConsentFormIfRequired(activity) { initAds() } },
            { initAds() }, // échec réseau : on tente quand même avec le consentement déjà connu
        )
        // Consentement déjà donné lors d'une session précédente : pas d'attente.
        if (consent.canRequestAds()) initAds()
    }

    private fun initAds() {
        if (!consent.canRequestAds() || initialized.getAndSet(true)) return
        MobileAds.initialize(activity) { load() }
    }

    private fun load() {
        if (loading || rewarded != null || !initialized.get()) return
        loading = true
        RewardedAd.load(activity, BuildConfig.ADMOB_REWARDED_ID, AdRequest.Builder().build(),
            object : RewardedAdLoadCallback() {
                override fun onAdLoaded(ad: RewardedAd) {
                    rewarded = ad
                    loading = false
                    retryDelayMs = 5_000L
                }

                override fun onAdFailedToLoad(error: LoadAdError) {
                    loading = false
                    // Nouvel essai avec délai croissant (max 2 min) : pas de boucle serrée.
                    handler.postDelayed(::load, retryDelayMs)
                    retryDelayMs = (retryDelayMs * 2).coerceAtMost(120_000L)
                }
            })
    }

    fun isReady(): Boolean = rewarded != null

    fun show(placement: String) {
        val ad = rewarded
        if (ad == null) {
            callMonet("onAdFailed", placement)
            load()
            return
        }
        rewarded = null
        var earned = false
        ad.fullScreenContentCallback = object : FullScreenContentCallback() {
            // La récompense n'est versée qu'à la fermeture de la vidéo, pour que
            // la notification du jeu apparaisse devant le joueur.
            override fun onAdDismissedFullScreenContent() {
                callMonet(if (earned) "onAdReward" else "onAdFailed", placement)
                load()
            }

            override fun onAdFailedToShowFullScreenContent(error: AdError) {
                callMonet("onAdFailed", placement)
                load()
            }
        }
        ad.show(activity) { earned = true }
    }

    fun privacyOptionsRequired(): Boolean =
        consent.privacyOptionsRequirementStatus == ConsentInformation.PrivacyOptionsRequirementStatus.REQUIRED

    fun showPrivacyOptions() {
        UserMessagingPlatform.showPrivacyOptionsForm(activity) { initAds() }
    }
}
