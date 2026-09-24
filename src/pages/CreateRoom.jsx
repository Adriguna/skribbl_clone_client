import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Clock3,
  RotateCcw,
  Languages,
  Settings2,
  Lightbulb,
} from "lucide-react";
import { socket } from "../services/socket";

function CreateRoom() {
  const navigate = useNavigate();

  const [playerName, setPlayerName] = useState(
    localStorage.getItem("playerName") || ""
  );

  const [maxPlayers, setMaxPlayers] = useState("8");
  const [rounds, setRounds] = useState("3");
  const [drawTime, setDrawTime] = useState("60");

  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "English"
  );

  const [gameMode, setGameMode] = useState("Normal");
  const [wordCount, setWordCount] = useState("3");
  const [hints, setHints] = useState("2");

  const [customWords, setCustomWords] = useState("");
  const [useCustomWords, setUseCustomWords] = useState(false);

  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const handleRoomCreated = (data) => {
      console.log("=================================");
      console.log("ROOM CREATED");
      console.log("Room ID:", data.roomId);
      console.log("Players:", data.players);
      console.log("Settings:", data.settings);
      console.log("Max Players:", data.settings?.maxPlayers);
      console.log("=================================");

      setCreating(false);

      navigate(`/lobby/${data.roomId}`, {
        state: {
          roomId: data.roomId,
          players: data.players || [],
          settings: data.settings || {},
          isHost: true,
        },
      });
    };

    const handleRoomError = (data) => {
      console.error("Room error:", data);

      setCreating(false);

      setError(
        data?.message || "Unable to create room."
      );
    };

    socket.on("room_created", handleRoomCreated);
    socket.on("room_error", handleRoomError);

    return () => {
      socket.off("room_created", handleRoomCreated);
      socket.off("room_error", handleRoomError);
    };
  }, [navigate]);

  const handleCreateRoom = () => {
    const trimmedName = playerName.trim();

    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }

    const selectedMaxPlayers = Number(maxPlayers);
    const selectedRounds = Number(rounds);
    const selectedDrawTime = Number(drawTime);
    const selectedWordCount = Number(wordCount);
    const selectedHints = Number(hints);

    if (
      !selectedMaxPlayers ||
      selectedMaxPlayers < 2
    ) {
      setError("Players must be at least 2.");
      return;
    }

    if (
      !selectedRounds ||
      selectedRounds < 2
    ) {
      setError("Rounds must be at least 2.");
      return;
    }

    if (
      !selectedDrawTime ||
      selectedDrawTime < 15
    ) {
      setError("Draw time must be at least 15 seconds.");
      return;
    }

    setError("");
    setCreating(true);

    localStorage.setItem(
      "playerName",
      trimmedName
    );

    localStorage.setItem(
      "language",
      language
    );

    const settings = {
      maxPlayers: selectedMaxPlayers,

      rounds: selectedRounds,

      drawTime: selectedDrawTime,

      language,

      gameMode,

      wordCount: selectedWordCount,

      hints: selectedHints,

      customWords: customWords
        .split(",")
        .map((word) => word.trim())
        .filter(Boolean),

      useCustomWords,
    };

    console.log(
      "Creating room with settings:",
      settings
    );

    socket.emit("create_room", {
      playerName: trimmedName,
      settings,
    });
  };

  return (
    <div className="create-room-page">

      {/* Background doodles */}

      <div className="create-doodle create-doodle-1">
        ✎
      </div>

      <div className="create-doodle create-doodle-2">
        ★
      </div>

      <div className="create-doodle create-doodle-3">
        ○
      </div>

      <div className="create-doodle create-doodle-4">
        ×
      </div>

      <div className="create-doodle create-doodle-5">
        〰
      </div>

      {/* Header */}

      <header className="create-header">

        <button
          className="back-button"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="small-logo">
          <span className="logo-s">s</span>
          <span className="logo-k">k</span>
          <span className="logo-r">r</span>
          <span className="logo-i">i</span>
          <span className="logo-b">b</span>
          <span className="logo-b2">b</span>
          <span className="logo-l">l</span>
        </div>

      </header>

      {/* Main */}

      <main className="create-main">

        <div className="create-card">

          <div className="create-title">

            <div className="create-title-icon">
              <Settings2 size={30} />
            </div>

            <div>
              <h1>Create Private Room</h1>
              <p>
                Customize your game before inviting friends.
              </p>
            </div>

          </div>

          {/* Player Name */}

          <div className="setting-group">

            <label>
              Player Name
            </label>

            <input
              type="text"
              value={playerName}
              maxLength={20}
              placeholder="Enter your name"
              onChange={(event) => {
                setPlayerName(event.target.value);
                setError("");
              }}
            />

          </div>

          <div className="settings-grid">

            {/* Players */}

            <div className="setting-group">

              <label>
                <Users size={17} />
                Players
              </label>

              <select
                value={maxPlayers}
                onChange={(event) => {
                  setMaxPlayers(event.target.value);
                  setError("");
                }}
              >
                <option value="2">
                  2 Players
                </option>

                <option value="3">
                  3 Players
                </option>

                <option value="4">
                  4 Players
                </option>

                <option value="5">
                  5 Players
                </option>

                <option value="6">
                  6 Players
                </option>

                <option value="7">
                  7 Players
                </option>

                <option value="8">
                  8 Players
                </option>

                <option value="10">
                  10 Players
                </option>

                <option value="12">
                  12 Players
                </option>
              </select>

            </div>

            {/* Language */}

            <div className="setting-group">

              <label>
                <Languages size={17} />
                Language
              </label>

              <select
                value={language}
                onChange={(event) =>
                  setLanguage(event.target.value)
                }
              >
                <option>English</option>
                <option>Hindi</option>
                <option>German</option>
                <option>Spanish</option>
                <option>French</option>
              </select>

            </div>

            {/* Draw Time */}

            <div className="setting-group">

              <label>
                <Clock3 size={17} />
                Draw Time
              </label>

              <select
                value={drawTime}
                onChange={(event) =>
                  setDrawTime(event.target.value)
                }
              >
                <option value="15">
                  15 Seconds
                </option>

                <option value="30">
                  30 Seconds
                </option>

                <option value="45">
                  45 Seconds
                </option>

                <option value="60">
                  60 Seconds
                </option>

                <option value="90">
                  90 Seconds
                </option>

                <option value="120">
                  120 Seconds
                </option>
              </select>

            </div>

            {/* Rounds */}

            <div className="setting-group">

              <label>
                <RotateCcw size={17} />
                Rounds
              </label>

              <select
                value={rounds}
                onChange={(event) =>
                  setRounds(event.target.value)
                }
              >
                <option value="2">
                  2 Rounds
                </option>

                <option value="3">
                  3 Rounds
                </option>

                <option value="4">
                  4 Rounds
                </option>

                <option value="5">
                  5 Rounds
                </option>

                <option value="6">
                  6 Rounds
                </option>

                <option value="7">
                  7 Rounds
                </option>

                <option value="8">
                  8 Rounds
                </option>

                <option value="9">
                  9 Rounds
                </option>

                <option value="10">
                  10 Rounds
                </option>
              </select>

            </div>

            {/* Game Mode */}

            <div className="setting-group">

              <label>
                🎮 Game Mode
              </label>

              <select
                value={gameMode}
                onChange={(event) =>
                  setGameMode(event.target.value)
                }
              >
                <option value="Normal">
                  Normal
                </option>

                <option value="Hidden">
                  Hidden
                </option>

                <option value="Combination">
                  Combination
                </option>
              </select>

            </div>

            {/* Word Count */}

            <div className="setting-group">

              <label>
                📝 Word Count
              </label>

              <select
                value={wordCount}
                onChange={(event) =>
                  setWordCount(event.target.value)
                }
              >
                <option value="1">
                  1 Word
                </option>

                <option value="2">
                  2 Words
                </option>

                <option value="3">
                  3 Words
                </option>

                <option value="4">
                  4 Words
                </option>

                <option value="5">
                  5 Words
                </option>
              </select>

            </div>

            {/* Hints */}

            <div className="setting-group">

              <label>
                <Lightbulb size={17} />
                Hints
              </label>

              <select
                value={hints}
                onChange={(event) =>
                  setHints(event.target.value)
                }
              >
                <option value="0">
                  No Hints
                </option>

                <option value="1">
                  1 Hint
                </option>

                <option value="2">
                  2 Hints
                </option>

                <option value="3">
                  3 Hints
                </option>
              </select>

            </div>

          </div>

          {/* Custom Words */}

          <div className="custom-word-section">

            <div className="custom-word-header">

              <div>

                <h3>
                  Custom Words
                </h3>

                <p>
                  Add your own words separated by commas.
                </p>

              </div>

              <label className="switch-wrapper">

                <input
                  type="checkbox"
                  checked={useCustomWords}
                  onChange={(event) =>
                    setUseCustomWords(
                      event.target.checked
                    )
                  }
                />

                <span className="custom-switch"></span>

              </label>

            </div>

            <input
              type="text"
              disabled={!useCustomWords}
              value={customWords}
              onChange={(event) =>
                setCustomWords(event.target.value)
              }
              placeholder="apple, computer, football, mountain..."
            />

          </div>

          {/* Error */}

          {error && (
            <div className="create-error">
              {error}
            </div>
          )}

          {/* Create Button */}

          <button
            className="create-room-button"
            onClick={handleCreateRoom}
            disabled={creating}
          >
            {creating
              ? "Creating Room..."
              : "Create Room"}
          </button>

          <p className="create-note">
            You will become the host of this room.
          </p>

        </div>

      </main>

    </div>
  );
}

export default CreateRoom;