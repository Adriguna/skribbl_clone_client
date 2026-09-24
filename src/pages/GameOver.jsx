import { useLocation, useNavigate } from "react-router-dom";

function GameOver() {
  const location = useLocation();
  const navigate = useNavigate();

  const players = location.state?.players || [];

  // Sort players by score
  const leaderboard = [...players].sort(
    (a, b) => (b.score || 0) - (a.score || 0)
  );

  const winner = leaderboard[0];

  return (
    <div className="game-over-page">

      {/* ==========================================
          TITLE
          ========================================== */}

      <h1>Game Over 🎉</h1>

      <p>
        All rounds have been completed.
      </p>

      {/* ==========================================
          WINNER
          ========================================== */}

      {winner && (
        <div className="winner-section">

          <h2>🏆 Winner</h2>

          <h3>
            {winner.name}
          </h3>

          <p>
            {winner.score || 0} points
          </p>

        </div>
      )}

      {/* ==========================================
          LEADERBOARD
          ========================================== */}

      <div className="leaderboard">

        <h2>
          Leaderboard
        </h2>

        {leaderboard.length === 0 ? (
          <p>
            No players found.
          </p>
        ) : (
          <div>

            {leaderboard.map(
              (player, index) => (
                <div
                  key={player.id}
                  className="leaderboard-player"
                >

                  <strong>
                    {index === 0
                      ? "🥇"
                      : index === 1
                      ? "🥈"
                      : index === 2
                      ? "🥉"
                      : `${index + 1}.`}
                  </strong>

                  {" "}

                  <span>
                    {player.name}
                  </span>

                  {" - "}

                  <strong>
                    {player.score || 0}
                  </strong>

                  {" points"}

                </div>
              )
            )}

          </div>
        )}

      </div>

      {/* ==========================================
          BACK BUTTON
          ========================================== */}

      <button
        onClick={() => navigate("/")}
      >
        Back to Home
      </button>

    </div>
  );
}

export default GameOver;