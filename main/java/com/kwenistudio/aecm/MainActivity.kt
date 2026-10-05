package com.kwenistudio.aecm

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.view.ViewGroup
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.widget.FrameLayout
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.updatePadding
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewClientCompat
import org.json.JSONObject

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView
    private lateinit var ads: AdsManager
    private lateinit var billing: BillingManager
    private lateinit var games: PlayGamesManager

    // Appels natif -> JS mis en attente tant que la page n'a pas fini de
    // charger (window.Monet / window.PlayGames n'existent pas encore).
    private var pageReady = false
    private val pendingJs = mutableListOf<String>()

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // targetSdk 35+ impose l'affichage bord à bord : on décale la WebView
        // sous les barres système plutôt que de dessiner dessous.
        WindowCompat.setDecorFitsSystemWindows(window, false)
        val root = FrameLayout(this).apply {
            setBackgroundColor(ContextCompat.getColor(this@MainActivity, R.color.game_background))
        }
        ViewCompat.setOnApplyWindowInsetsListener(root) { v, insets ->
            val bars = insets.getInsets(WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout())
            val ime = insets.getInsets(WindowInsetsCompat.Type.ime())
            v.updatePadding(left = bars.left, top = bars.top, right = bars.right, bottom = maxOf(bars.bottom, ime.bottom))
            WindowInsetsCompat.CONSUMED
        }

        val loader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        webView = WebView(this)
        root.addView(webView, FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT))
        setContentView(root)

        webView.setBackgroundColor(ContextCompat.getColor(this, R.color.game_background))
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true      // sauvegarde du jeu (localStorage + IndexedDB)
            mediaPlaybackRequiresUserGesture = false
            allowFileAccess = false
            allowContentAccess = false
            textZoom = 100                // ignore la taille de police système : la mise en page du jeu est fixe
        }
        webView.webChromeClient = WebChromeClient() // alert()/confirm() natifs
        webView.webViewClient = object : WebViewClientCompat() {
            override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse? =
                loader.shouldInterceptRequest(request.url)

            // Liens externes (site, politique de confidentialité…) : navigateur du téléphone.
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                if (request.url.host == WebViewAssetLoader.DEFAULT_DOMAIN) return false
                runCatching { startActivity(Intent(Intent.ACTION_VIEW, request.url)) }
                return true
            }

            override fun onPageFinished(view: WebView, url: String) {
                pageReady = true
                pendingJs.forEach { webView.evaluateJavascript(it, null) }
                pendingJs.clear()
            }
        }

        ads = AdsManager(this, ::callJs)
        billing = BillingManager(this, ::callJs)
        games = PlayGamesManager(this, ::callJs)
        webView.addJavascriptInterface(AndroidBridge(this, ads, billing, games), "AndroidBridge")

        if (savedInstanceState != null) webView.restoreState(savedInstanceState)
        else webView.loadUrl("https://${WebViewAssetLoader.DEFAULT_DOMAIN}/assets/www/index.html")

        ads.start()
        billing.start()
        games.start()

        // Retour : le jeu est une page unique, on met l'app en arrière-plan
        // au lieu de la fermer (la partie reste là où on l'a laissée).
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) webView.goBack() else moveTaskToBack(true)
            }
        })
    }

    /** Appelle window.<objet>.<méthode>(args…) côté jeu, sur le thread UI. */
    fun callJs(target: String, method: String, vararg args: Any?) {
        val params = args.joinToString(",") { a ->
            when (a) {
                null -> "null"
                is Boolean, is Number -> a.toString()
                else -> JSONObject.quote(a.toString())
            }
        }
        val script = "window.$target && window.$target.$method && window.$target.$method($params);"
        runOnUiThread {
            if (pageReady) webView.evaluateJavascript(script, null) else pendingJs += script
        }
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        webView.saveState(outState)
    }

    override fun onPause() { super.onPause(); webView.onPause() }
    override fun onResume() { super.onResume(); webView.onResume() }

    override fun onDestroy() {
        billing.stop()
        webView.destroy()
        super.onDestroy()
    }
}
