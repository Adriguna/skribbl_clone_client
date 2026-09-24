import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";

import {
  Clock3,
  Users,
  Palette,
  Eraser,
  Undo2,
  Trash2,
  Minus,
  Plus,
  Trophy,
  Crown,
  Send,
} from "lucide-react";

import { socket } from "../services/socket";
import DrawingCanvas from "../components/DrawingCanvas";
import Chat from "../components/Chat";

// =========================================================
// COLORS
// =========================================================

const COLORS = [
  "#000000",
  "#ffffff",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#795548",
  "#64748b",
];

// =========================================================
// AVATAR COLORS
// =========================================================

const AVATAR_COLORS = [
  {
    skin: "#ffd0a8",
    hair: "#5b321c",
    shirt: "#ef5350",
  },
  {
    skin: "#f2b48b",
    hair: "#222222",
    shirt: "#42a5f5",
  },
  {
    skin: "#ffe0bd",
    hair: "#e0a21a",
    shirt: "#66bb6a",
  },
  {
    skin: "#c98b65",
    hair: "#3a2418",
    shirt: "#ab47bc",
  },
  {
    skin: "#f6c49f",
    hair: "#d94c3d",
    shirt: "#ffca28",
  },
  {
    skin: "#e5a77c",
    hair: "#111111",
    shirt: "#26a69a",
  },
];

// =========================================================
// GAME AVATAR
// =========================================================

function GameAvatar({ index = 0 }) {
  const avatar =
    AVATAR_COLORS[index % AVATAR_COLORS.length];

  return (
    <div className="game-avatar">
      <div
        className="game-avatar-head"
        style={{
          backgroundColor: avatar.skin,
        }}
      >
        <div
          className="game-avatar-hair"
          style={{
            backgroundColor: avatar.hair,
          }}
        />

        <span className="game-avatar-eye left" />
        <span className="game-avatar-eye right" />
        <span className="game-avatar-mouth" />
      </div>

      <div
        className="game-avatar-body"
        style={{
          backgroundColor: avatar.shirt,
        }}
      />
    </div>
  );
}

// =========================================================
// GAME COMPONENT
// =========================================================

function Game() {
  const { roomId } = useParams();

  const navigate = useNavigate();

  const location = useLocation();

  // =========================================================
  // INITIAL GAME DATA
  // =========================================================

  const initialGameData = location.state || {};

  console.log(
    "================================="
  );

  console.log(
    "GAME PAGE INITIAL DATA:"
  );

  console.log(initialGameData);

  console.log(
    "================================="
  );

  // =========================================================
  // PLAYER
  // =========================================================

  const playerName =
    localStorage.getItem("playerName") ||
    "Player";

  // =========================================================
  // GAME STATE
  // =========================================================

  const [round, setRound] = useState(
    Number(initialGameData.round) || 0
  );

  const [drawerId, setDrawerId] = useState(
    initialGameData.drawerId || null
  );

  const [players, setPlayers] = useState(
    initialGameData.players || []
  );

  const [settings, setSettings] = useState(
    initialGameData.settings || {
      rounds: 3,
      drawTime: 60,
    }
  );

  const [drawTime, setDrawTime] = useState(
    Number(initialGameData.drawTime) || 60
  );

  const [timeLeft, setTimeLeft] = useState(
    Number(initialGameData.drawTime) || 60
  );

  const [roundEnded, setRoundEnded] =
    useState(false);

  const [roundEndData, setRoundEndData] =
    useState(null);

  // =========================================================
  // WORD STATE
  // =========================================================

  const [wordOptions, setWordOptions] =
    useState(
      initialGameData.wordOptions || []
    );

  const [selectedWord, setSelectedWord] =
    useState("");

  const [maskedWord, setMaskedWord] =
    useState("");

  const [wordSelected, setWordSelected] =
    useState(false);

  // =========================================================
  // HINT STATE
  // =========================================================

  /*
   * Example:
   *
   * word = "MOUNTAIN"
   *
   * Initially:
   * _ _ _ _ _ _ _ _
   *
   * After hint:
   * _ O _ _ _ _ _ _
   *
   * Another hint:
   * _ O _ N _ _ _ _
   *
   * The server controls which letter is revealed.
   */

  const [hints, setHints] = useState([]);

  const [hintCounter, setHintCounter] =
    useState(0);

  // =========================================================
  // GUESS STATE
  // =========================================================

  const [guessResult, setGuessResult] =
    useState("");

  // =========================================================
  // GAME OVER
  // =========================================================

  const [gameOver, setGameOver] =
    useState(false);

  const [finalPlayers, setFinalPlayers] =
    useState([]);

  // =========================================================
  // DRAWING TOOL STATE
  // =========================================================

  const [selectedColor, setSelectedColor] =
    useState("#000000");

  const [brushSize, setBrushSize] =
    useState(5);

  const [isEraser, setIsEraser] =
    useState(false);

  const [clearSignal, setClearSignal] =
    useState(0);

  // =========================================================
  // ERROR
  // =========================================================

  const [error, setError] =
    useState("");

  // =========================================================
  // CURRENT PLAYER
  // =========================================================

  const currentPlayer =
    players.find(
      (player) =>
        player.id === socket.id
    );

  // =========================================================
  // CHECK DRAWER
  // =========================================================

  const isDrawer =
    drawerId === socket.id;

  // =========================================================
  // RANDOM HINT POSITION
  // =========================================================

  const getRandomHintPosition = () => {
    /*
     * Keep hints away from the extreme edges.
     *
     * These values are percentages and CSS
     * will position them relative to the
     * center game area.
     */

    const left =
      Math.floor(
        Math.random() * 75
      ) + 10;

    const top =
      Math.floor(
        Math.random() * 65
      ) + 15;

    return {
      left: `${left}%`,
      top: `${top}%`,
    };
  };

  // =========================================================
  // RESET HINTS
  // =========================================================

  const resetHints = () => {
    setHints([]);
    setHintCounter(0);
  };

  // =========================================================
  // RESET ROUND STATE
  // =========================================================

  const resetRoundState = (data) => {
    console.log(
      "RESETTING ROUND:",
      data
    );

    setRound(
      Number(data.round) || 0
    );

    setDrawerId(
      data.drawerId || null
    );

    setWordOptions(
      data.wordOptions || []
    );

    setDrawTime(
      Number(data.drawTime) || 60
    );

    setTimeLeft(
      Number(data.drawTime) || 60
    );

    setRoundEnded(false);

    setRoundEndData(null);

    setWordSelected(false);

    setSelectedWord("");

    setMaskedWord("");

    setGuessResult("");

    setError("");

    setGameOver(false);

    setIsEraser(false);

    setSelectedColor(
      "#000000"
    );

    setBrushSize(5);

    // Reset all hints
    resetHints();

    setClearSignal(
      (previous) =>
        previous + 1
    );

    if (
      Array.isArray(
        data.players
      )
    ) {
      setPlayers(
        data.players
      );
    }

    if (
      data.settings
    ) {
      setSettings(
        data.settings
      );
    }
  };

  // =========================================================
  // ADD HINT TO SCREEN
  // =========================================================

  const addHintToScreen = (data) => {
    /*
     * Do not show hints to drawer.
     */

    if (isDrawer) {
      return;
    }

    /*
     * Server may send:
     *
     * {
     *   position: 2,
     *   letter: "A",
     *   maskedWord: "_ A _ _"
     * }
     *
     * or simply:
     *
     * {
     *   letter: "A",
     *   position: 2
     * }
     */

    const letter =
      data?.letter ||
      data?.char ||
      "";

    const position =
      data?.position ??
      data?.index ??
      null;

    if (!letter) {
      return;
    }

    const newHintId =
      Date.now() +
      Math.random();

    const randomPosition =
      getRandomHintPosition();

    const newHint = {
      id: newHintId,
      letter: letter,
      position: position,
      style: randomPosition,
    };

    setHints(
      (previous) => [
        ...previous,
        newHint,
      ]
    );

    setHintCounter(
      (previous) =>
        previous + 1
    );

    /*
     * Remove the floating hint after animation.
     * The actual revealed letter remains in
     * maskedWord.
     */

    setTimeout(() => {
      setHints(
        (previous) =>
          previous.filter(
            (hint) =>
              hint.id !==
              newHintId
          )
      );
    }, 3200);
  };

  // =========================================================
  // SOCKET EVENTS
  // =========================================================

  useEffect(() => {
    // =======================================================
    // GAME STARTED
    // =======================================================

    const handleGameStarted = (
      data
    ) => {
      console.log(
        "================================="
      );

      console.log(
        "GAME STARTED / NEW ROUND"
      );

      console.log(
        "Game data:",
        data
      );

      console.log(
        "================================="
      );

      resetRoundState(
        data
      );
    };

    // =======================================================
    // WORD CHOSEN
    // =======================================================

    const handleWordChosen = (
      data
    ) => {
      console.log(
        "WORD CHOSEN:",
        data
      );

      // -----------------------------------------------------
      // DRAWER RECEIVES ACTUAL WORD
      // -----------------------------------------------------

      if (data.word) {
        setSelectedWord(
          data.word
        );

        setWordSelected(
          true
        );

        setMaskedWord(
          data.word
        );

        // Drawer does not need hints.
        resetHints();

        return;
      }

      // -----------------------------------------------------
      // GUESSERS RECEIVE MASKED WORD
      // -----------------------------------------------------

      if (data.maskedWord) {
        setMaskedWord(
          data.maskedWord
        );

        setWordSelected(
          true
        );

        resetHints();
      }
    };

    // =======================================================
    // HINT REVEALED
    // =======================================================

    const handleHintRevealed = (
      data
    ) => {
      console.log(
        "HINT REVEALED:",
        data
      );

      /*
       * Update the masked word first.
       *
       * Example:
       *
       * "_ _ _ _ _"
       *
       * becomes
       *
       * "_ A _ _ _"
       */

      if (
        data?.maskedWord
      ) {
        setMaskedWord(
          data.maskedWord
        );
      }

      /*
       * Show floating random hint.
       */

      addHintToScreen(
        data
      );
    };

    // =======================================================
    // MASKED WORD UPDATE
    // =======================================================

    const handleMaskedWordUpdate = (
      data
    ) => {
      console.log(
        "MASKED WORD UPDATE:",
        data
      );

      if (
        data?.maskedWord
      ) {
        setMaskedWord(
          data.maskedWord
        );
      }

      /*
       * If server sends a letter together
       * with maskedWord, show floating hint.
       */

      if (
        data?.letter ||
        data?.char
      ) {
        addHintToScreen(
          data
        );
      }
    };

    // =======================================================
    // TIMER
    // =======================================================

    const handleTimerTick = (
      data
    ) => {
      const remaining =
        Number(
          data.timeLeft
        ) || 0;

      setTimeLeft(
        remaining
      );

      if (
        remaining > 0
      ) {
        setRoundEnded(
          false
        );
      }
    };

    // =======================================================
    // SCORE UPDATE
    // =======================================================

    const handleScoreUpdate = (
      data
    ) => {
      console.log(
        "SCORE UPDATE:",
        data
      );

      if (
        Array.isArray(
          data.players
        )
      ) {
        setPlayers(
          data.players
        );
      }
    };

    // =======================================================
    // PLAYERS UPDATE
    // =======================================================

    const handlePlayersUpdate = (
      data
    ) => {
      console.log(
        "PLAYERS UPDATE:",
        data
      );

      if (
        Array.isArray(
          data.players
        )
      ) {
        setPlayers(
          data.players
        );
      }
    };

    // =======================================================
    // PLAYER LEFT
    // =======================================================

    const handlePlayerLeft = (
      data
    ) => {
      console.log(
        "PLAYER LEFT:",
        data
      );

      if (
        Array.isArray(
          data.players
        )
      ) {
        setPlayers(
          data.players
        );
      }
    };

    // =======================================================
    // ROUND ENDED
    // =======================================================

    const handleRoundEnded = (
      data
    ) => {
      console.log(
        "ROUND ENDED:",
        data
      );

      setTimeLeft(0);

      setRoundEnded(
        true
      );

      setRoundEndData(
        data
      );

      /*
       * Remove floating hints when
       * round finishes.
       */

      resetHints();

      if (
        Array.isArray(
          data.players
        )
      ) {
        setPlayers(
          data.players
        );
      }

      setClearSignal(
        (previous) =>
          previous + 1
      );
    };

    // =======================================================
    // GUESS RESULT
    // =======================================================

    const handleGuessResult = (
      data
    ) => {
      console.log(
        "GUESS RESULT:",
        data
      );

      setGuessResult(
        data.message || ""
      );

      if (
        data.correct
      ) {
        setTimeout(() => {
          setGuessResult("");
        }, 3000);
      }
    };

    // =======================================================
    // GAME OVER
    // =======================================================

    const handleGameOver = (
      data
    ) => {
      console.log(
        "GAME OVER:",
        data
      );

      setGameOver(
        true
      );

      setRoundEnded(
        true
      );

      setTimeLeft(0);

      resetHints();

      const sortedPlayers = [
        ...(data.players || []),
      ].sort(
        (a, b) =>
          (b.score || 0) -
          (a.score || 0)
      );

      setFinalPlayers(
        sortedPlayers
      );

      setPlayers(
        sortedPlayers
      );
    };

    // =======================================================
    // ROOM ERROR
    // =======================================================

    const handleRoomError = (
      data
    ) => {
      console.error(
        "ROOM ERROR:",
        data
      );

      setError(
        data?.message ||
          "Something went wrong."
      );
    };

    // =======================================================
    // REGISTER SOCKET EVENTS
    // =======================================================

    socket.on(
      "game_started",
      handleGameStarted
    );

    socket.on(
      "word_chosen",
      handleWordChosen
    );

    socket.on(
      "hint_revealed",
      handleHintRevealed
    );

    socket.on(
      "masked_word_update",
      handleMaskedWordUpdate
    );

    socket.on(
      "timer_tick",
      handleTimerTick
    );

    socket.on(
      "score_update",
      handleScoreUpdate
    );

    socket.on(
      "players_update",
      handlePlayersUpdate
    );

    socket.on(
      "player_left",
      handlePlayerLeft
    );

    socket.on(
      "round_ended",
      handleRoundEnded
    );

    socket.on(
      "guess_result",
      handleGuessResult
    );

    socket.on(
      "game_over",
      handleGameOver
    );

    socket.on(
      "room_error",
      handleRoomError
    );

    // =======================================================
    // CLEANUP
    // =======================================================

    return () => {
      socket.off(
        "game_started",
        handleGameStarted
      );

      socket.off(
        "word_chosen",
        handleWordChosen
      );

      socket.off(
        "hint_revealed",
        handleHintRevealed
      );

      socket.off(
        "masked_word_update",
        handleMaskedWordUpdate
      );

      socket.off(
        "timer_tick",
        handleTimerTick
      );

      socket.off(
        "score_update",
        handleScoreUpdate
      );

      socket.off(
        "players_update",
        handlePlayersUpdate
      );

      socket.off(
        "player_left",
        handlePlayerLeft
      );

      socket.off(
        "round_ended",
        handleRoundEnded
      );

      socket.off(
        "guess_result",
        handleGuessResult
      );

      socket.off(
        "game_over",
        handleGameOver
      );

      socket.off(
        "room_error",
        handleRoomError
      );
    };
  }, []);

  // =========================================================
  // WORD SELECTION
  // =========================================================

  const handleWordSelect = (
    word
  ) => {
    if (!isDrawer) {
      return;
    }

    if (roundEnded) {
      return;
    }

    if (!word) {
      return;
    }

    console.log(
      "Selecting word:",
      word
    );

    socket.emit(
      "word_chosen",
      {
        word,
      }
    );
  };

  // =========================================================
  // COLOR
  // =========================================================

  const handleColorChange = (
    color
  ) => {
    if (!isDrawer) {
      return;
    }

    setSelectedColor(
      color
    );

    setIsEraser(
      false
    );
  };

  // =========================================================
  // ERASER
  // =========================================================

  const handleEraser = () => {
    if (!isDrawer) {
      return;
    }

    setIsEraser(
      (previous) =>
        !previous
    );
  };

  // =========================================================
  // BRUSH SIZE
  // =========================================================

  const increaseBrushSize =
    () => {
      if (!isDrawer) {
        return;
      }

      setBrushSize(
        (previous) =>
          Math.min(
            previous + 2,
            30
          )
      );
    };

  const decreaseBrushSize =
    () => {
      if (!isDrawer) {
        return;
      }

      setBrushSize(
        (previous) =>
          Math.max(
            previous - 2,
            2
          )
      );
    };

  // =========================================================
  // CLEAR CANVAS
  // =========================================================

  const handleClearCanvas =
    () => {
      if (!isDrawer) {
        return;
      }

      socket.emit(
        "clear_drawing"
      );

      setClearSignal(
        (previous) =>
          previous + 1
      );
    };

  // =========================================================
  // LEAVE GAME
  // =========================================================

  const handleLeaveGame =
    () => {
      socket.disconnect();

      socket.connect();

      navigate("/");
    };

  // =========================================================
  // SORT PLAYERS
  // =========================================================

  const sortedPlayers = [
    ...players,
  ].sort(
    (a, b) =>
      (b.score || 0) -
      (a.score || 0)
  );

  // =========================================================
  // GAME OVER
  // =========================================================

  if (gameOver) {
    return (
      <div className="game-over-page">
        <div className="game-over-card">

          <div className="game-over-icon">
            <Trophy size={42} />
          </div>

          <h1>
            Game Over!
          </h1>

          <p className="game-over-room">
            Room: {roomId}
          </p>

          <div className="winner-section">

            {finalPlayers.length >
              0 && (
              <>
                <Crown
                  size={30}
                  className="winner-crown"
                />

                <h2>
                  {
                    finalPlayers[0]
                      ?.name ||
                    "Winner"
                  }
                </h2>

                <p>
                  {
                    finalPlayers[0]
                      ?.score || 0
                  }{" "}
                  points
                </p>
              </>
            )}

          </div>

          <div className="final-scoreboard">

            {finalPlayers.map(
              (
                player,
                index
              ) => (
                <div
                  key={
                    player.id
                  }
                  className={`final-player ${
                    player.id ===
                    socket.id
                      ? "current-player"
                      : ""
                  }`}
                >

                  <span className="final-rank">
                    #{index + 1}
                  </span>

                  <GameAvatar
                    index={index}
                  />

                  <span className="final-name">
                    {player.name}

                    {player.id ===
                      socket.id && (
                      <small>
                        {" "}
                        (You)
                      </small>
                    )}
                  </span>

                  <strong>
                    {
                      player.score ||
                      0
                    }
                  </strong>

                </div>
              )
            )}

          </div>

          <button
            className="game-home-button"
            onClick={
              handleLeaveGame
            }
          >
            Back to Home
          </button>

        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN GAME
  // =========================================================

  return (
    <div className="game-page">

      {/* ===================================================
          TOP BAR
          =================================================== */}

      <header className="game-topbar">

        <div className="game-logo">

          <span className="logo-blue">
            s
          </span>

          <span className="logo-orange">
            k
          </span>

          <span className="logo-green">
            r
          </span>

          <span className="logo-purple">
            i
          </span>

          <span className="logo-red">
            b
          </span>

          <span className="logo-yellow">
            b
          </span>

          <span className="logo-blue">
            l
          </span>

        </div>

        <div className="game-room-info">

          <span>
            Room
          </span>

          <strong>
            {roomId}
          </strong>

        </div>

        <div className="game-round-info">

          <span>
            Round
          </span>

          <strong>
            {round}
            {" / "}
            {settings.rounds ||
              3}
          </strong>

        </div>

        <div
          className={`game-timer ${
            timeLeft <= 10
              ? "danger"
              : ""
          }`}
        >

          <Clock3 size={20} />

          <strong>
            {timeLeft}s
          </strong>

        </div>

        <button
          className="leave-game-button"
          onClick={
            handleLeaveGame
          }
        >
          Leave
        </button>

      </header>

      {/* ===================================================
          ERROR
          =================================================== */}

      {error && (
        <div className="game-error">
          {error}
        </div>
      )}

      {/* ===================================================
          GAME CONTENT
          =================================================== */}

      <main className="game-layout">

        {/* =================================================
            PLAYERS
            ================================================= */}

        <aside className="game-players-panel">

          <div className="players-title">

            <Users size={19} />

            <span>
              Players
            </span>

            <small>
              {players.length}
            </small>

          </div>

          <div className="players-list">

            {sortedPlayers.map(
              (
                player,
                index
              ) => {

                const playerIsDrawer =
                  player.id ===
                  drawerId;

                const isCurrentPlayer =
                  player.id ===
                  socket.id;

                return (
                  <div
                    key={
                      player.id
                    }
                    className={`game-player ${
                      isCurrentPlayer
                        ? "you"
                        : ""
                    } ${
                      playerIsDrawer
                        ? "drawing"
                        : ""
                    }`}
                  >

                    <GameAvatar
                      index={index}
                    />

                    <div className="game-player-details">

                      <div className="game-player-name">

                        {playerIsDrawer && (
                          <Crown
                            size={13}
                            className="drawer-crown"
                          />
                        )}

                        <span>
                          {
                            player.name
                          }
                        </span>

                        {isCurrentPlayer && (
                          <small>
                            You
                          </small>
                        )}

                      </div>

                      <span className="game-player-score">
                        {
                          player.score ||
                          0
                        }{" "}
                        pts
                      </span>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </aside>

        {/* =================================================
            CENTER
            ================================================= */}

        <section className="game-center">

          {/* =================================================
              STATUS
              ================================================= */}

          <div className="game-status">

            {roundEnded ? (
              <div className="round-ended-status">

                <strong>
                  Round Over!
                </strong>

                {roundEndData?.word && (
                  <span>
                    The word was{" "}
                    <b>
                      {
                        roundEndData.word
                      }
                    </b>
                  </span>
                )}

              </div>
            ) : isDrawer ? (
              <div className="drawer-status">

                {!wordSelected ? (
                  <>
                    <strong>
                      Choose a word
                    </strong>

                    <span>
                      Pick one of the
                      words below
                    </span>
                  </>
                ) : (
                  <>
                    <strong>
                      You are drawing
                    </strong>

                    <span>
                      Your word:{" "}
                      <b>
                        {
                          selectedWord
                        }
                      </b>
                    </span>
                  </>
                )}

              </div>
            ) : (
              <div className="guesser-status">

                <strong>
                  {wordSelected
                    ? "Guess the word!"
                    : "Waiting for the drawer..."}
                </strong>

                {wordSelected && (
                  <div className="masked-word">
                    {maskedWord}
                  </div>
                )}

              </div>
            )}

          </div>

          {/* =================================================
              FLOATING HINTS
              ================================================= */}

          {!isDrawer &&
            wordSelected &&
            !roundEnded && (
              <div className="floating-hints-layer">

                {hints.map(
                  (hint) => (
                    <div
                      key={
                        hint.id
                      }
                      className="floating-hint"
                      style={
                        hint.style
                      }
                    >
                      <span>
                        {hint.letter}
                      </span>
                    </div>
                  )
                )}

              </div>
            )}

          {/* =================================================
              WORD OPTIONS
              ================================================= */}

          {isDrawer &&
            !wordSelected &&
            !roundEnded &&
            wordOptions.length >
              0 && (
            <div className="word-selection">

              <p>
                Choose one word
                to draw:
              </p>

              <div className="word-options">

                {wordOptions.map(
                  (word) => (
                    <button
                      key={
                        word
                      }
                      className="word-option"
                      onClick={() =>
                        handleWordSelect(
                          word
                        )
                      }
                    >
                      {word}
                    </button>
                  )
                )}

              </div>

            </div>
          )}

          {/* =================================================
              CANVAS
              ================================================= */}

          <div className="canvas-wrapper">

            <DrawingCanvas
              key={`${round}-${drawerId}`}
              isDrawer={
                isDrawer &&
                wordSelected &&
                !roundEnded
              }
              disabled={
                !isDrawer ||
                !wordSelected ||
                roundEnded
              }
              color={
                isEraser
                  ? "#ffffff"
                  : selectedColor
              }
              brushSize={
                isEraser
                  ? brushSize * 3
                  : brushSize
              }
              clearSignal={
                clearSignal
              }
            />

            {/* WAITING OVERLAY */}

            {!isDrawer &&
              !wordSelected &&
              !roundEnded && (
                <div className="canvas-overlay">

                  <div>

                    <Palette
                      size={32}
                    />

                    <span>
                      Waiting for
                      the drawer to
                      choose a word...
                    </span>

                  </div>

                </div>
              )}

            {/* ROUND OVERLAY */}

            {roundEnded &&
              !gameOver && (
                <div className="canvas-overlay round-overlay">

                  <div>

                    <Trophy
                      size={34}
                    />

                    <strong>
                      Round Complete
                    </strong>

                    {roundEndData?.word && (
                      <span>
                        Word:{" "}
                        <b>
                          {
                            roundEndData.word
                          }
                        </b>
                      </span>
                    )}

                    <small>
                      Next round
                      starting soon...
                    </small>

                  </div>

                </div>
              )}

          </div>

          {/* =================================================
              DRAWING TOOLBAR
              ================================================= */}

          {isDrawer &&
            wordSelected &&
            !roundEnded && (
            <div className="drawing-toolbar">

              {/* COLORS */}

              <div className="toolbar-section">

                <span className="toolbar-label">
                  Color
                </span>

                <div className="color-list">

                  {COLORS.map(
                    (color) => (
                      <button
                        key={
                          color
                        }
                        className={`color-button ${
                          selectedColor ===
                            color &&
                          !isEraser
                            ? "active"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            color,
                        }}
                        onClick={() =>
                          handleColorChange(
                            color
                          )
                        }
                        title={
                          color
                        }
                      />
                    )
                  )}

                </div>

              </div>

              {/* TOOLS */}

              <div className="toolbar-section toolbar-tools">

                <span className="toolbar-label">
                  Tools
                </span>

                <button
                  className={`tool-button ${
                    isEraser
                      ? "active"
                      : ""
                  }`}
                  onClick={
                    handleEraser
                  }
                  title="Eraser"
                >
                  <Eraser
                    size={18}
                  />
                </button>

                <button
                  className="tool-button"
                  onClick={
                    decreaseBrushSize
                  }
                  title="Smaller brush"
                >
                  <Minus
                    size={18}
                  />
                </button>

                <div className="brush-size">
                  {brushSize}
                </div>

                <button
                  className="tool-button"
                  onClick={
                    increaseBrushSize
                  }
                  title="Larger brush"
                >
                  <Plus
                    size={18}
                  />
                </button>

                <button
                  className="tool-button"
                  title="Undo"
                  onClick={() =>
                    socket.emit(
                      "undo_drawing"
                    )
                  }
                >
                  <Undo2
                    size={18}
                  />
                </button>

                <button
                  className="tool-button clear-tool"
                  title="Clear canvas"
                  onClick={
                    handleClearCanvas
                  }
                >
                  <Trash2
                    size={18}
                  />
                </button>

              </div>

            </div>
          )}

        </section>

        {/* =================================================
            CHAT
            ================================================= */}

        <aside className="game-chat-panel">

          <div className="chat-header">

            <Send size={18} />

            <span>
              Chat & Guess
            </span>

          </div>

          <div className="chat-content">
            <Chat />
          </div>

          {guessResult && (
            <div className="guess-result">

              <strong>
                {guessResult}
              </strong>

            </div>
          )}

          {currentPlayer && (
            <div className="chat-player-info">

              <span>
                You
              </span>

              <strong>
                {
                  currentPlayer.score ||
                  0
                }{" "}
                pts
              </strong>

            </div>
          )}

        </aside>

      </main>

    </div>
  );
}

export default Game;