import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";

import {
  ArrowLeft,
  Copy,
  Check,
  Crown,
  Users,
  Clock3,
  RotateCcw,
  Languages,
  Play,
  LogOut,
} from "lucide-react";

import { socket } from "../services/socket";

// =========================================================
// AVATAR COLORS
// =========================================================

const avatarColors = [
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
  {
    skin: "#ffd9b5",
    hair: "#743f22",
    shirt: "#ec407a",
  },
  {
    skin: "#c88963",
    hair: "#21160f",
    shirt: "#7e57c2",
  },
];

// =========================================================
// LOBBY AVATAR
// =========================================================

function LobbyAvatar({
  index = 0,
}) {
  const avatar =
    avatarColors[
      index % avatarColors.length
    ];

  return (
    <div className="lobby-avatar">

      <div
        className="lobby-avatar-head"
        style={{
          backgroundColor:
            avatar.skin,
        }}
      >

        <div
          className="lobby-avatar-hair"
          style={{
            backgroundColor:
              avatar.hair,
          }}
        />

        <span className="lobby-avatar-eye left" />

        <span className="lobby-avatar-eye right" />

        <span className="lobby-avatar-mouth" />

      </div>

      <div
        className="lobby-avatar-body"
        style={{
          backgroundColor:
            avatar.shirt,
        }}
      />

    </div>
  );
}

// =========================================================
// LOBBY
// =========================================================

function Lobby() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const { roomId } =
    useParams();

  // =========================================================
  // INITIAL DATA
  // =========================================================

  const initialState =
    location.state || {};

  const [players, setPlayers] =
    useState(
      initialState.players || []
    );

  const [settings, setSettings] =
    useState(
      initialState.settings || {}
    );

  const [isHost, setIsHost] =
    useState(
      Boolean(
        initialState.isHost
      )
    );

  const [copied, setCopied] =
    useState(false);

  const [error, setError] =
    useState("");

  const [starting, setStarting] =
    useState(false);

  // =========================================================
  // PLAYER NAME
  // =========================================================

  const playerName =
    localStorage.getItem(
      "playerName"
    ) || "Player";

  // =========================================================
  // SOCKET EVENTS
  // =========================================================

  useEffect(() => {

    // =======================================================
    // ROOM CREATED
    // =======================================================

    const handleRoomCreated = (
      data
    ) => {
      console.log(
        "Lobby - room_created:",
        data
      );

      setPlayers(
        data.players || []
      );

      setSettings(
        data.settings || {}
      );

      // Creator is always host.
      setIsHost(true);

      setError("");
    };

    // =======================================================
    // ROOM JOINED
    // =======================================================

    const handleRoomJoined = (
      data
    ) => {
      console.log(
        "Lobby - room_joined:",
        data
      );

      const updatedPlayers =
        data.players || [];

      const updatedSettings =
        data.settings || {};

      setPlayers(
        updatedPlayers
      );

      setSettings(
        updatedSettings
      );

      // -----------------------------------------------------
      // Determine host.
      //
      // Prefer server-provided isHost.
      // If server does not provide it, use the first player
      // as the host because the server creates the host first.
      // -----------------------------------------------------

      const hostFromServer =
        data.isHost !==
        undefined
          ? Boolean(
              data.isHost
            )
          : updatedPlayers.length >
              0 &&
            updatedPlayers[0].id ===
              socket.id;

      setIsHost(
        hostFromServer
      );

      setError("");
    };

    // =======================================================
    // PLAYER JOINED
    // =======================================================

    const handlePlayerJoined = (
      data
    ) => {
      console.log(
        "Lobby - player_joined:",
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
        "Lobby - player_left:",
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
        "Lobby - players_update:",
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
    // ROOM ERROR
    // =======================================================

    const handleRoomError = (
      data
    ) => {
      console.error(
        "Lobby - room_error:",
        data
      );

      setError(
        data?.message ||
          "Something went wrong."
      );

      setStarting(
        false
      );
    };

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
        "Lobby - game_started:"
      );

      console.log(
        data
      );

      console.log(
        "================================="
      );

      setStarting(
        false
      );

      // -----------------------------------------------------
      // IMPORTANT:
      // Pass the COMPLETE game state to Game.jsx.
      // Game.jsx reads this through useLocation().
      // -----------------------------------------------------

      navigate(
        `/game/${
          data.roomId ||
          roomId
        }`,
        {
          state: {
            roomId:
              data.roomId ||
              roomId,

            round:
              data.round,

            drawerId:
              data.drawerId,

            drawTime:
              data.drawTime,

            wordOptions:
              data.wordOptions ||
              [],

            players:
              data.players ||
              players,

            settings:
              data.settings ||
              settings,
          },
        }
      );
    };

    // =======================================================
    // REGISTER SOCKET EVENTS
    // =======================================================

    socket.on(
      "room_created",
      handleRoomCreated
    );

    socket.on(
      "room_joined",
      handleRoomJoined
    );

    socket.on(
      "player_joined",
      handlePlayerJoined
    );

    socket.on(
      "player_left",
      handlePlayerLeft
    );

    socket.on(
      "players_update",
      handlePlayersUpdate
    );

    socket.on(
      "room_error",
      handleRoomError
    );

    socket.on(
      "game_started",
      handleGameStarted
    );

    // =======================================================
    // CLEANUP
    // =======================================================

    return () => {

      socket.off(
        "room_created",
        handleRoomCreated
      );

      socket.off(
        "room_joined",
        handleRoomJoined
      );

      socket.off(
        "player_joined",
        handlePlayerJoined
      );

      socket.off(
        "player_left",
        handlePlayerLeft
      );

      socket.off(
        "players_update",
        handlePlayersUpdate
      );

      socket.off(
        "room_error",
        handleRoomError
      );

      socket.off(
        "game_started",
        handleGameStarted
      );
    };

  }, [
    navigate,
    roomId,
    players,
    settings,
  ]);

  // =========================================================
  // DEBUG
  // =========================================================

  useEffect(() => {
    console.log(
      "================================="
    );

    console.log(
      "LOBBY CURRENT DATA"
    );

    console.log(
      "Room ID:",
      roomId
    );

    console.log(
      "Players:",
      players
    );

    console.log(
      "Settings:",
      settings
    );

    console.log(
      "Max Players:",
      settings.maxPlayers
    );

    console.log(
      "Is Host:",
      isHost
    );

    console.log(
      "Current Socket:",
      socket.id
    );

    console.log(
      "================================="
    );
  }, [
    roomId,
    players,
    settings,
    isHost,
  ]);

  // =========================================================
  // COPY ROOM CODE
  // =========================================================

  const copyRoomCode =
    async () => {
      try {
        await navigator.clipboard.writeText(
          roomId
        );

        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 2000);

      } catch (error) {
        console.error(
          "Unable to copy room code:",
          error
        );
      }
    };

  // =========================================================
  // COPY INVITE LINK
  // =========================================================

  const copyInviteLink =
    async () => {
      const inviteLink =
        `${window.location.origin}/join-room?room=${roomId}`;

      try {
        await navigator.clipboard.writeText(
          inviteLink
        );

        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 2000);

      } catch (error) {
        console.error(
          "Unable to copy invite link:",
          error
        );
      }
    };

  // =========================================================
  // START GAME
  // =========================================================

  const handleStartGame =
    () => {

      // -----------------------------------------------------
      // ONLY HOST
      // -----------------------------------------------------

      if (!isHost) {
        setError(
          "Only the host can start the game."
        );

        return;
      }

      // -----------------------------------------------------
      // MAX PLAYERS
      // -----------------------------------------------------

      const maxPlayers =
        Number(
          settings.maxPlayers
        ) || 2;

      // -----------------------------------------------------
      // MINIMUM PLAYERS
      // -----------------------------------------------------

      if (
        players.length < 2
      ) {
        setError(
          "At least 2 players are required to start the game."
        );

        return;
      }

      // -----------------------------------------------------
      // MAXIMUM PLAYERS CHECK
      //
      // IMPORTANT:
      //
      // If room is configured for 8 players and only
      // 2 players joined, the game CAN start.
      //
      // 8 = maximum players
      // 2 = minimum players
      // -----------------------------------------------------

      if (
        players.length >
        maxPlayers
      ) {
        setError(
          "The room has more players than allowed."
        );

        return;
      }

      setError("");

      setStarting(
        true
      );

      console.log(
        "Starting game..."
      );

      console.log(
        "Room:",
        roomId
      );

      console.log(
        "Players:",
        players
      );

      console.log(
        "Settings:",
        settings
      );

      socket.emit(
        "start_game"
      );
    };

  // =========================================================
  // LEAVE ROOM
  // =========================================================

  const handleLeaveRoom =
    () => {
      socket.disconnect();

      socket.connect();

      navigate("/");
    };

  // =========================================================
  // UI VALUES
  // =========================================================

  const maxPlayers =
    Number(
      settings.maxPlayers
    ) || 2;

  const rounds =
    Number(
      settings.rounds
    ) || 3;

  const drawTime =
    Number(
      settings.drawTime
    ) || 60;

  const language =
    settings.language ||
    "English";

  const gameMode =
    settings.gameMode ||
    "Normal";

  const wordCount =
    Number(
      settings.wordCount
    ) || 3;

  const hints =
    settings.hints ?? 2;

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="lobby-page">

      {/* ===================================================
          BACKGROUND DOODLES
          =================================================== */}

      <div className="lobby-doodle lobby-doodle-1">
        ✎
      </div>

      <div className="lobby-doodle lobby-doodle-2">
        ★
      </div>

      <div className="lobby-doodle lobby-doodle-3">
        ○
      </div>

      <div className="lobby-doodle lobby-doodle-4">
        ×
      </div>

      <div className="lobby-doodle lobby-doodle-5">
        〰
      </div>

      {/* ===================================================
          HEADER
          =================================================== */}

      <header className="lobby-header">

        <button
          className="lobby-back-button"
          onClick={() =>
            navigate("/")
          }
        >
          <ArrowLeft
            size={19}
          />

          Home
        </button>

        <div className="lobby-logo">

          <span className="logo-s">
            s
          </span>

          <span className="logo-k">
            k
          </span>

          <span className="logo-r">
            r
          </span>

          <span className="logo-i">
            i
          </span>

          <span className="logo-b">
            b
          </span>

          <span className="logo-b2">
            b
          </span>

          <span className="logo-l">
            l
          </span>

        </div>

        <button
          className="leave-room-button"
          onClick={
            handleLeaveRoom
          }
        >
          <LogOut
            size={17}
          />

          Leave
        </button>

      </header>

      {/* ===================================================
          MAIN
          =================================================== */}

      <main className="lobby-main">

        {/* =================================================
            ROOM CODE
            ================================================= */}

        <section className="room-code-card">

          <div className="room-code-title">

            <span>
              PRIVATE ROOM
            </span>

            <div className="room-live-dot" />

          </div>

          <div className="room-code">
            {roomId}
          </div>

          <p>
            Share this code with
            your friends
          </p>

          <div className="room-actions">

            <button
              className="copy-code-button"
              onClick={
                copyRoomCode
              }
            >

              {copied ? (
                <>
                  <Check
                    size={18}
                  />

                  Copied!
                </>
              ) : (
                <>
                  <Copy
                    size={18}
                  />

                  Copy Code
                </>
              )}

            </button>

            <button
              className="copy-invite-button"
              onClick={
                copyInviteLink
              }
            >

              <Copy
                size={18}
              />

              Copy Invite Link

            </button>

          </div>

        </section>

        {/* =================================================
            CONTENT
            ================================================= */}

        <div className="lobby-content">

          {/* =================================================
              PLAYERS
              ================================================= */}

          <section className="lobby-panel players-panel">

            <div className="panel-heading">

              <div className="panel-title">

                <Users
                  size={21}
                />

                <h2>
                  Players
                </h2>

              </div>

              <span className="player-count">
                {players.length}
                /
                {maxPlayers}
              </span>

            </div>

            <div className="players-grid">

              {players.map(
                (
                  player,
                  index
                ) => {

                  const playerIsHost =
                    index === 0;

                  const isCurrentPlayer =
                    player.id ===
                      socket.id ||
                    player.name ===
                      playerName;

                  return (
                    <div
                      className={`player-card ${
                        isCurrentPlayer
                          ? "current-player"
                          : ""
                      }`}
                      key={
                        player.id ||
                        index
                      }
                    >

                      <div className="player-avatar-wrapper">

                        <LobbyAvatar
                          index={
                            index
                          }
                        />

                        {playerIsHost && (
                          <div className="host-crown">

                            <Crown
                              size={15}
                              fill="currentColor"
                            />

                          </div>
                        )}

                      </div>

                      <div className="player-info">

                        <strong>
                          {
                            player.name
                          }
                        </strong>

                        {playerIsHost && (
                          <span className="host-label">
                            Host
                          </span>
                        )}

                        {isCurrentPlayer && (
                          <span className="you-label">
                            You
                          </span>
                        )}

                      </div>

                    </div>
                  );
                }
              )}

              {/* =================================================
                  EMPTY SLOTS
                  ================================================= */}

              {Array.from({
                length:
                  Math.max(
                    0,
                    maxPlayers -
                      players.length
                  ),
              }).map(
                (
                  _,
                  index
                ) => (
                  <div
                    className="empty-player-card"
                    key={`empty-${index}`}
                  >

                    <div className="empty-player-icon">

                      <Users
                        size={23}
                      />

                    </div>

                    <span>
                      Waiting...
                    </span>

                  </div>
                )
              )}

            </div>

          </section>

          {/* =================================================
              SETTINGS
              ================================================= */}

          <section className="lobby-panel settings-panel">

            <div className="panel-heading">

              <div className="panel-title">

                <span className="settings-emoji">
                  ⚙️
                </span>

                <h2>
                  Room Settings
                </h2>

              </div>

            </div>

            <div className="lobby-settings">

              {/* PLAYERS */}

              <div className="lobby-setting">

                <div className="setting-icon">

                  <Users
                    size={19}
                  />

                </div>

                <div>

                  <span>
                    Players
                  </span>

                  <strong>
                    {maxPlayers}
                  </strong>

                </div>

              </div>

              {/* LANGUAGE */}

              <div className="lobby-setting">

                <div className="setting-icon">

                  <Languages
                    size={19}
                  />

                </div>

                <div>

                  <span>
                    Language
                  </span>

                  <strong>
                    {language}
                  </strong>

                </div>

              </div>

              {/* DRAW TIME */}

              <div className="lobby-setting">

                <div className="setting-icon">

                  <Clock3
                    size={19}
                  />

                </div>

                <div>

                  <span>
                    Draw Time
                  </span>

                  <strong>
                    {drawTime}s
                  </strong>

                </div>

              </div>

              {/* ROUNDS */}

              <div className="lobby-setting">

                <div className="setting-icon">

                  <RotateCcw
                    size={19}
                  />

                </div>

                <div>

                  <span>
                    Rounds
                  </span>

                  <strong>
                    {rounds}
                  </strong>

                </div>

              </div>

              {/* GAME MODE */}

              <div className="lobby-setting">

                <div className="setting-icon">
                  🎮
                </div>

                <div>

                  <span>
                    Game Mode
                  </span>

                  <strong>
                    {gameMode}
                  </strong>

                </div>

              </div>

              {/* WORD COUNT */}

              <div className="lobby-setting">

                <div className="setting-icon">
                  📝
                </div>

                <div>

                  <span>
                    Word Count
                  </span>

                  <strong>
                    {wordCount}
                  </strong>

                </div>

              </div>

              {/* HINTS */}

              <div className="lobby-setting">

                <div className="setting-icon">
                  💡
                </div>

                <div>

                  <span>
                    Hints
                  </span>

                  <strong>
                    {hints}
                  </strong>

                </div>

              </div>

            </div>

          </section>

        </div>

        {/* =================================================
            ERROR
            ================================================= */}

        {error && (
          <div className="lobby-error">
            {error}
          </div>
        )}

        {/* =================================================
            START GAME
            ================================================= */}

        <section className="start-section">

          {isHost ? (
            <>
              <button
                className="start-game-button"
                onClick={
                  handleStartGame
                }
                disabled={
                  starting
                }
              >

                <Play
                  size={25}
                  fill="currentColor"
                />

                {starting
                  ? "Starting Game..."
                  : "START GAME"}

              </button>

              <p className="start-help">
                You are the host.
                Start the game when
                everyone is ready.
              </p>
            </>
          ) : (
            <>
              <div className="waiting-button">

                <div className="waiting-spinner" />

                Waiting for host
                to start...

              </div>

              <p className="start-help">
                The host will start
                the game when
                everyone is ready.
              </p>
            </>
          )}

        </section>

      </main>

      {/* ===================================================
          FOOTER
          =================================================== */}

      <footer className="lobby-footer">

        <span>
          {players.length} player
          {players.length !== 1
            ? "s"
            : ""}{" "}
          in room
        </span>

        <span>
          •
        </span>

        <span>
          Have fun drawing! 🎨
        </span>

      </footer>

    </div>
  );
}

export default Lobby;