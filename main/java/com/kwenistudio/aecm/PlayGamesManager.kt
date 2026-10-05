package com.kwenistudio.aecm

import android.app.Activity
import android.widget.Toast
import com.google.android.gms.games.PlayGames
import com.google.android.gms.games.PlayGamesSdk

/**
 * Classements Google Play Games. Désactivé (sans plantage) tant que
 * res/values/games.xml contient game_services_project_id = 0.
 * Rappelle le jeu via PlayGames.onSignedIn / onSignInFailed / onScoreSubmitted.
 */
class PlayGamesManager(
    private val activity: Activity,
    private val js: (String, String, Array<out Any?>) -> Unit,
) {
    private val enabled = activity.getString(R.string.game_services_project_id) != "0"

    @Volatile var signedIn = false
        private set

    private fun callGames(method: String, vararg args: Any?) = js("PlayGames", method, args)

    /** Identifiant de classement Play Console correspondant à l'identifiant du jeu. */
    private fun leaderboardFor(gameId: String): String? = when (gameId) {
        "career_points" -> activity.getString(R.string.leaderboard_career_points)
        "reputation" -> activity.getString(R.string.leaderboard_reputation)
        else -> null
    }?.takeUnless { it == "A_REMPLACER" }

    fun start() {
        if (!enabled) return
        PlayGamesSdk.initialize(activity)
        // Play Games tente une connexion automatique au lancement.
        PlayGames.getGamesSignInClient(activity).isAuthenticated.addOnCompleteListener { task ->
            if (task.isSuccessful && task.result.isAuthenticated) onAuthenticated()
        }
    }

    fun signIn() {
        if (!enabled) {
            Toast.makeText(activity, R.string.games_not_configured, Toast.LENGTH_SHORT).show()
            callGames("onSignInFailed")
            return
        }
        PlayGames.getGamesSignInClient(activity).signIn().addOnCompleteListener { task ->
            if (task.isSuccessful && task.result.isAuthenticated) onAuthenticated()
            else { signedIn = false; callGames("onSignInFailed") }
        }
    }

    private fun onAuthenticated() {
        signedIn = true
        PlayGames.getPlayersClient(activity).currentPlayer
            .addOnSuccessListener { callGames("onSignedIn", it.displayName) }
            .addOnFailureListener { callGames("onSignedIn", null) }
    }

    fun submitScore(gameId: String, score: Long) {
        val id = leaderboardFor(gameId)
        if (!enabled || !signedIn || id == null) {
            callGames("onScoreSubmitted", gameId, false)
            return
        }
        PlayGames.getLeaderboardsClient(activity).submitScoreImmediate(id, score)
            .addOnCompleteListener { callGames("onScoreSubmitted", gameId, it.isSuccessful) }
    }

    @Suppress("DEPRECATION")
    fun showLeaderboard(gameId: String) {
        val id = leaderboardFor(gameId) ?: return
        if (!enabled || !signedIn) return
        PlayGames.getLeaderboardsClient(activity).getLeaderboardIntent(id)
            .addOnSuccessListener { activity.startActivityForResult(it, 9004) }
    }
}
