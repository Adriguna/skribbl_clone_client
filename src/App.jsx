import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";
import GameOver from "./pages/GameOver";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* CREATE ROOM */}
        <Route
          path="/create-room"
          element={<CreateRoom />}
        />

        {/* JOIN ROOM */}
        <Route
          path="/join-room"
          element={<JoinRoom />}
        />

        {/* LOBBY */}
        <Route
          path="/lobby/:roomId"
          element={<Lobby />}
        />

        {/* GAME */}
        <Route
          path="/game/:roomId"
          element={<Game />}
        />

        {/* GAME OVER */}
        <Route
          path="/game-over"
          element={<GameOver />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;