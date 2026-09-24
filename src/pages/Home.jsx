import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dices, ChevronLeft, ChevronRight, Play } from "lucide-react";

const avatars = [
  { skin: "#ffd0a8", hair: "#5b321c", shirt: "#ef5350" },
  { skin: "#f2b48b", hair: "#222", shirt: "#42a5f5" },
  { skin: "#ffe0bd", hair: "#e0a21a", shirt: "#66bb6a" },
  { skin: "#c98b65", hair: "#3a2418", shirt: "#ab47bc" },
  { skin: "#f6c49f", hair: "#d94c3d", shirt: "#ffca28" },
  { skin: "#e5a77c", hair: "#111", shirt: "#26a69a" },
  { skin: "#ffd9b5", hair: "#743f22", shirt: "#ec407a" },
  { skin: "#c88963", hair: "#21160f", shirt: "#7e57c2" },
];

function Home() {
  const navigate = useNavigate();

  const [playerName, setPlayerName] = useState(
    localStorage.getItem("playerName") || ""
  );

  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "English"
  );

  const [avatarIndex, setAvatarIndex] = useState(
    Number(localStorage.getItem("avatarIndex")) || 0
  );

  const avatar = avatars[avatarIndex];

  const savePlayerData = () => {
    const name = playerName.trim();

    if (!name) {
      alert("Please enter your name");
      return false;
    }

    localStorage.setItem("playerName", name);
    localStorage.setItem("language", language);
    localStorage.setItem("avatarIndex", avatarIndex);

    return true;
  };

  const handlePlay = () => {
    if (!savePlayerData()) return;

    // Our clone does not have public matchmaking yet.
    // So Play takes the player to Join Room.
    navigate("/join-room");
  };

  const handleCreateRoom = () => {
    if (!savePlayerData()) return;

    navigate("/create-room");
  };

  const previousAvatar = () => {
    setAvatarIndex((current) =>
      current === 0 ? avatars.length - 1 : current - 1
    );
  };

  const nextAvatar = () => {
    setAvatarIndex((current) =>
      current === avatars.length - 1 ? 0 : current + 1
    );
  };

  const randomAvatar = () => {
    let random = Math.floor(Math.random() * avatars.length);

    while (random === avatarIndex && avatars.length > 1) {
      random = Math.floor(Math.random() * avatars.length);
    }

    setAvatarIndex(random);
  };

  return (
    <div className="home-page">
      {/* Background doodles */}
      <div className="doodle doodle-pencil">✎</div>
      <div className="doodle doodle-star">★</div>
      <div className="doodle doodle-circle">○</div>
      <div className="doodle doodle-cross">×</div>
      <div className="doodle doodle-heart">♥</div>
      <div className="doodle doodle-square">□</div>
      <div className="doodle doodle-zigzag">〰</div>
      <div className="doodle doodle-scribble">〽</div>

      {/* Header */}
      <header className="home-header">
        <div className="clone-logo">
          <span className="logo-s">s</span>
          <span className="logo-k">k</span>
          <span className="logo-r">r</span>
          <span className="logo-i">i</span>
          <span className="logo-b">b</span>
          <span className="logo-b2">b</span>
          <span className="logo-l">l</span>
        </div>

        <div className="logo-pencil">✎</div>
      </header>

      {/* Main hero */}
      <main className="home-main">
        <section className="hero-section">

          {/* Cartoon characters */}
          <div className="avatar-row">
            {avatars.map((item, index) => (
              <div
                className={`mini-character character-${index}`}
                key={index}
              >
                <div
                  className="mini-head"
                  style={{
                    backgroundColor: item.skin,
                  }}
                >
                  <div
                    className="mini-hair"
                    style={{
                      backgroundColor: item.hair,
                    }}
                  />

                  <span className="mini-eye left-eye"></span>
                  <span className="mini-eye right-eye"></span>

                  <span className="mini-mouth"></span>
                </div>

                <div
                  className="mini-body"
                  style={{
                    backgroundColor: item.shirt,
                  }}
                />

                <div className="mini-arm left-arm"></div>
                <div className="mini-arm right-arm"></div>
              </div>
            ))}
          </div>

          {/* Player form */}
          <div className="home-card">
            <div className="player-name-wrapper">
              <input
                type="text"
                value={playerName}
                maxLength={20}
                placeholder="Enter your name"
                onChange={(event) => setPlayerName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handlePlay();
                  }
                }}
              />
            </div>

            <div className="language-wrapper">
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
              >
                <option>English</option>
                <option>Hindi</option>
                <option>German</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>

            {/* Avatar selector */}
            <div className="avatar-selector">
              <button
                className="avatar-arrow"
                onClick={previousAvatar}
                type="button"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="selected-avatar">
                <div
                  className="big-avatar-head"
                  style={{
                    backgroundColor: avatar.skin,
                  }}
                >
                  <div
                    className="big-avatar-hair"
                    style={{
                      backgroundColor: avatar.hair,
                    }}
                  />

                  <span className="big-eye left"></span>
                  <span className="big-eye right"></span>

                  <span className="big-mouth"></span>
                </div>

                <div
                  className="big-avatar-body"
                  style={{
                    backgroundColor: avatar.shirt,
                  }}
                />

                <div className="big-arm big-left-arm"></div>
                <div className="big-arm big-right-arm"></div>
              </div>

              <button
                className="avatar-arrow"
                onClick={nextAvatar}
                type="button"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <button
              className="random-avatar-button"
              type="button"
              onClick={randomAvatar}
            >
              <Dices size={18} />
              Random Avatar
            </button>

            {/* Main buttons */}
            <div className="main-buttons">
              <button
                className="play-button"
                onClick={handlePlay}
              >
                <Play size={22} fill="white" />
                Play!
              </button>

              <button
                className="private-room-button"
                onClick={handleCreateRoom}
              >
                Create Private Room
              </button>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="info-section">
          <div className="info-card">
            <div className="info-icon">🎨</div>

            <h2>About</h2>

            <p>
              Skribbl Clone is a multiplayer drawing and guessing game.
              One player draws a word while the other players try to
              guess it and earn points.
            </p>

            <p>
              Take turns drawing, guess the hidden words and try to
              become the player with the highest score!
            </p>
          </div>

          {/* How to play */}
          <div className="info-card">
            <div className="info-icon">🎮</div>

            <h2>How to Play</h2>

            <div className="how-to-list">
              <div className="how-item">
                <span>1</span>
                <p>Join a room with your friends.</p>
              </div>

              <div className="how-item">
                <span>2</span>
                <p>When it is your turn, choose a word.</p>
              </div>

              <div className="how-item">
                <span>3</span>
                <p>Draw the selected word on the canvas.</p>
              </div>

              <div className="how-item">
                <span>4</span>
                <p>Other players try to guess the word.</p>
              </div>

              <div className="how-item">
                <span>5</span>
                <p>Score points and become the winner!</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="info-card">
            <div className="info-icon">✨</div>

            <h2>Features</h2>

            <ul className="feature-list">
              <li>Real-time multiplayer drawing</li>
              <li>Private rooms</li>
              <li>Live guessing chat</li>
              <li>Turn-based gameplay</li>
              <li>Scoring and leaderboard</li>
              <li>Round timer</li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <p>
          Skribbl Clone • Multiplayer Drawing & Guessing Game
        </p>

        <p className="footer-small">
          Built with React, Node.js, Express & Socket.IO
        </p>
      </footer>
    </div>
  );
}

export default Home;