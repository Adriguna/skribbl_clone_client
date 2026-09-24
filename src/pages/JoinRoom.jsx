import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  DoorOpen,
  KeyRound,
  UserRound,
  Sparkles,
  Users,
} from "lucide-react";

import { socket } from "../services/socket";

function JoinRoom() {
  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [playerName, setPlayerName] =
    useState(
      localStorage.getItem(
        "playerName"
      ) || ""
    );

  const [roomId, setRoomId] =
    useState("");

  const [error, setError] =
    useState("");

  // =========================================================
  // SOCKET EVENTS
  // =========================================================

  useEffect(() => {
    // =======================================================
    // ROOM JOINED
    // =======================================================

    const handleRoomJoined = (
      data
    ) => {
      console.log(
        "================================="
      );

      console.log(
        "ROOM JOINED"
      );

      console.log(
        "Room ID:",
        data.roomId
      );

      console.log(
        "Players:",
        data.players
      );

      console.log(
        "Settings:",
        data.settings
      );

      console.log(
        "Max Players:",
        data.settings?.maxPlayers
      );

      console.log(
        "================================="
      );

      navigate(
        `/lobby/${data.roomId}`,
        {
          state: {
            roomId:
              data.roomId,

            players:
              data.players || [],

            settings:
              data.settings || {},

            isHost: false,
          },
        }
      );
    };

    // =======================================================
    // ROOM ERROR
    // =======================================================

    const handleRoomError = (
      data
    ) => {
      console.error(
        "Join room error:",
        data
      );

      setError(
        data?.message ||
          "Unable to join room."
      );
    };

    // =======================================================
    // REGISTER EVENTS
    // =======================================================

    socket.on(
      "room_joined",
      handleRoomJoined
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
        "room_joined",
        handleRoomJoined
      );

      socket.off(
        "room_error",
        handleRoomError
      );
    };
  }, [navigate]);

  // =========================================================
  // JOIN ROOM
  // =========================================================

  const handleJoinRoom = () => {
    const trimmedName =
      playerName.trim();

    const trimmedRoomId =
      roomId
        .trim()
        .toUpperCase();

    // -------------------------------------------------------
    // NAME VALIDATION
    // -------------------------------------------------------

    if (!trimmedName) {
      setError(
        "Please enter your name."
      );

      return;
    }

    // -------------------------------------------------------
    // ROOM ID VALIDATION
    // -------------------------------------------------------

    if (!trimmedRoomId) {
      setError(
        "Please enter the room code."
      );

      return;
    }

    // -------------------------------------------------------
    // ROOM CODE LENGTH
    // -------------------------------------------------------

    if (
      trimmedRoomId.length !== 6
    ) {
      setError(
        "Room code must be 6 characters."
      );

      return;
    }

    // -------------------------------------------------------
    // CLEAR ERROR
    // -------------------------------------------------------

    setError("");

    // -------------------------------------------------------
    // SAVE PLAYER NAME
    // -------------------------------------------------------

    localStorage.setItem(
      "playerName",
      trimmedName
    );

    // -------------------------------------------------------
    // JOIN ROOM
    // -------------------------------------------------------

    console.log(
      "Joining room:",
      trimmedRoomId
    );

    socket.emit(
      "join_room",
      {
        roomId:
          trimmedRoomId,

        playerName:
          trimmedName,
      }
    );
  };

  // =========================================================
  // ENTER KEY
  // =========================================================

  const handleKeyDown = (
    event
  ) => {
    if (
      event.key === "Enter"
    ) {
      handleJoinRoom();
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="join-room-page">

      {/* ===================================================
          BACKGROUND DOODLES
          =================================================== */}

      <div className="join-doodle join-doodle-1">
        ✎
      </div>

      <div className="join-doodle join-doodle-2">
        ★
      </div>

      <div className="join-doodle join-doodle-3">
        ○
      </div>

      <div className="join-doodle join-doodle-4">
        ×
      </div>

      <div className="join-doodle join-doodle-5">
        〰
      </div>

      <div className="join-doodle join-doodle-6">
        +
      </div>

      {/* ===================================================
          HEADER
          =================================================== */}

      <header className="join-room-header">

        <button
          className="join-back-button"
          onClick={() =>
            navigate("/")
          }
        >
          <ArrowLeft
            size={18}
          />

          Back
        </button>

        <div className="join-logo">

          <span className="join-logo-s">
            s
          </span>

          <span className="join-logo-k">
            k
          </span>

          <span className="join-logo-r">
            r
          </span>

          <span className="join-logo-i">
            i
          </span>

          <span className="join-logo-b">
            b
          </span>

          <span className="join-logo-b2">
            b
          </span>

          <span className="join-logo-l">
            l
          </span>

        </div>

        <div className="join-header-spacer" />

      </header>

      {/* ===================================================
          MAIN
          =================================================== */}

      <main className="join-room-main">

        <section className="join-room-card">

          {/* =================================================
              CARD HEADER
              ================================================= */}

          <div className="join-card-header">

            <div className="join-card-icon">

              <DoorOpen
                size={32}
              />

            </div>

            <div>

              <h1>
                Join Room
              </h1>

              <p>
                Enter the room code
                and start drawing
                with your friends.
              </p>

            </div>

          </div>

          <div className="join-divider" />

          {/* =================================================
              FORM
              ================================================= */}

          <div className="join-form">

            {/* =================================================
                PLAYER NAME
                ================================================= */}

            <div className="join-field">

              <label
                htmlFor="player-name"
              >
                <UserRound
                  size={17}
                />

                Player Name
              </label>

              <div className="join-input-wrapper">

                <UserRound
                  size={19}
                  className="join-input-icon"
                />

                <input
                  id="player-name"
                  type="text"
                  value={
                    playerName
                  }
                  onChange={(
                    event
                  ) => {
                    setPlayerName(
                      event.target
                        .value
                    );

                    setError("");
                  }}
                  onKeyDown={
                    handleKeyDown
                  }
                  placeholder="Enter your name"
                  maxLength={20}
                  autoComplete="off"
                />

              </div>

            </div>

            {/* =================================================
                ROOM CODE
                ================================================= */}

            <div className="join-field">

              <label
                htmlFor="room-code"
              >
                <KeyRound
                  size={17}
                />

                Room Code
              </label>

              <div className="join-input-wrapper">

                <KeyRound
                  size={19}
                  className="join-input-icon"
                />

                <input
                  id="room-code"
                  type="text"
                  value={
                    roomId
                  }
                  onChange={(
                    event
                  ) => {
                    setRoomId(
                      event.target
                        .value
                        .toUpperCase()
                    );

                    setError("");
                  }}
                  onKeyDown={
                    handleKeyDown
                  }
                  placeholder="Enter 6-character room code"
                  maxLength={6}
                  autoComplete="off"
                  spellCheck="false"
                />

              </div>

              <div className="room-code-help">

                <span>
                  Example:
                </span>

                <strong>
                  ABC123
                </strong>

              </div>

            </div>

            {/* =================================================
                ERROR
                ================================================= */}

            {error && (
              <div className="join-error">

                <span className="join-error-icon">
                  !
                </span>

                <span>
                  {error}
                </span>

              </div>
            )}

            {/* =================================================
                JOIN BUTTON
                ================================================= */}

            <button
              className="join-submit-button"
              onClick={
                handleJoinRoom
              }
            >

              <DoorOpen
                size={21}
              />

              Join Room

            </button>

          </div>

          {/* =================================================
              INFO
              ================================================= */}

          <div className="join-info-box">

            <div className="join-info-icon">
              <Users
                size={20}
              />
            </div>

            <div>

              <strong>
                Joining a private game
              </strong>

              <span>
                Ask the host for the
                6-character room code.
              </span>

            </div>

          </div>

          {/* =================================================
              BACK BUTTON
              ================================================= */}

          <button
            className="join-secondary-button"
            onClick={() =>
              navigate("/")
            }
          >
            <ArrowLeft
              size={17}
            />

            Back to Home

          </button>

        </section>

        {/* =================================================
            BOTTOM MESSAGE
            ================================================= */}

        <div className="join-bottom-message">

          <Sparkles
            size={17}
          />

          <span>
            Draw. Guess. Have fun!
          </span>

        </div>

      </main>

    </div>
  );
}

export default JoinRoom;