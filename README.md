# 🎨 Skribbl Clone — Frontend

A real-time multiplayer drawing and guessing game inspired by **skribbl.io**, built with React and Vite.

The frontend provides the complete player interface for creating and joining rooms, managing the lobby, drawing on a shared canvas, guessing words, chatting with players, viewing scores, receiving hints, and displaying the final leaderboard.

---

## 🚀 Live Demo

### 🎮 Play the Game

https://skribbl-clone-by-riteshpathak.netlify.app

### ⚙️ Backend API / Socket Server

https://skribbl-clone-backend-m4du.onrender.com

### 📦 Backend Repository

https://github.com/Adriguna/skribbl_clone_backend

---

## 📌 Project Overview

Skribbl Clone is a real-time multiplayer drawing and guessing game.

Players join the same room and take turns drawing a selected word while the other players try to guess it.

The application uses **Socket.IO** to communicate with the backend in real time.

The frontend is responsible for:

* Room creation
* Room joining
* Lobby interface
* Player list
* Game interface
* Drawing canvas
* Drawing tools
* Word selection
* Guess submission
* Chat
* Hints
* Timer
* Score display
* Leaderboard
* Game-over screen
* Responsive user interface

---

# ✨ Features

## 🏠 Room Management

* Create a multiplayer room
* Generate a unique room code
* Join an existing room
* Display room information
* Display connected players
* Host-controlled game start

---

## 👥 Multiplayer Lobby

The lobby displays the players currently connected to the room.

Players can see:

* Player names
* Host information
* Number of players
* Room code
* Game settings

The host can start the game once the room is ready.

---

## 🎨 Real-Time Drawing

The game includes a canvas-based drawing system.

The drawer can use:

* Brush
* Different colors
* Brush size
* Eraser
* Undo
* Clear canvas

Drawing actions are synchronized with other players using Socket.IO.

---

## 📝 Word Selection

At the beginning of a turn, the drawer receives multiple word choices.

The drawer selects one word and starts drawing.

Other players do not see the selected word directly.

---

## 🔤 Guessing

Players can submit their guesses through the game interface.

Correct guesses are detected by the backend and the player's score is updated.

Players who guess earlier receive more points than players who guess later.

---

## 💡 Progressive Hints

The game provides hints while the round progresses.

Letters are progressively revealed to guessing players as the timer decreases.

The revealed letters can appear at different positions in the word.

The drawer continues to see the complete word.

---

## 💬 Real-Time Chat

Players can communicate with each other through the in-game chat.

Chat messages are transmitted through Socket.IO and displayed to players in the same room.

---

## ⏱️ Timer

Each drawing round has a countdown timer.

The timer controls the duration of the round and is synchronized with the game state received from the backend.

A round can finish when:

* The timer reaches zero
* The word is successfully guessed

---

## 🏆 Scoring & Leaderboard

Players receive points for correctly guessing the word.

The scoring system considers the time taken to guess.

```text
Faster correct guess
        ↓
Higher score

Later correct guess
        ↓
Lower score
```

The leaderboard displays player scores throughout the game and the final ranking is displayed when the game ends.

---

## 🔄 Multiple Rounds

The game supports multiple rounds.

After a round finishes:

```text
Round Ends
    ↓
Scores Updated
    ↓
Next Drawer
    ↓
Next Round
```

After all configured rounds are completed, the game moves to the final leaderboard/game-over screen.

---

# 🛠️ Tech Stack

## Frontend

* React
* Vite
* JavaScript / JSX
* React Router
* Socket.IO Client
* Lucide React
* HTML5 Canvas
* CSS

The current project dependencies include React 19, React DOM 19, React Router DOM 7, Socket.IO Client 4, Lucide React, and Vite 8.

---

# 📂 Project Structure

```text
client/
│
├── public/
│   ├── _redirects
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   │
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   │
│   ├── components/
│   │   ├── Chat.jsx
│   │   ├── DrawingCanvas.jsx
│   │   ├── DrawingToolbar.jsx
│   │   ├── Leaderboard.jsx
│   │   ├── Navbar.jsx
│   │   └── PlayerList.jsx
│   │
│   ├── pages/
│   │   ├── CreateRoom.jsx
│   │   ├── Game.jsx
│   │   ├── GameOver.jsx
│   │   ├── Home.jsx
│   │   ├── JoinRoom.jsx
│   │   └── Lobby.jsx
│   │
│   ├── services/
│   │   └── socket.js
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
└── vite.config.js
```

---

# 🧩 Main Components

## `CreateRoom.jsx`

Provides the interface for creating a new game room.

Players can configure game options before creating the room.

---

## `JoinRoom.jsx`

Allows players to enter:

* Player name
* Room code

and join an existing multiplayer game.

---

## `Lobby.jsx`

Displays the room before the game starts.

It provides:

* Player list
* Room code
* Game settings
* Host controls
* Start game action

---

## `Game.jsx`

Main game screen.

It coordinates:

* Game state
* Current player
* Current drawer
* Timer
* Word state
* Drawing area
* Chat
* Scores
* Hints
* Guessing

---

## `DrawingCanvas.jsx`

Responsible for the drawing canvas.

It handles the player's drawing interaction and communicates drawing data through the Socket.IO connection.

---

## `DrawingToolbar.jsx`

Provides drawing controls such as:

* Brush
* Colors
* Brush size
* Eraser
* Undo
* Clear

---

## `Chat.jsx`

Displays the real-time game chat and allows players to send messages and guesses.

---

## `PlayerList.jsx`

Displays players currently participating in the room.

---

## `Leaderboard.jsx`

Displays player scores and leaderboard information.

---

## `GameOver.jsx`

Displays the final game results after all rounds are completed.

---

## `Navbar.jsx`

Provides navigation and common application interface elements.

---

# 🔌 Socket.IO Connection

The frontend communicates with the backend using Socket.IO Client.

Production backend:

```text
https://skribbl-clone-backend-m4du.onrender.com
```

The socket service is located at:

```text
src/services/socket.js
```

Example:

```js
import { io } from "socket.io-client";

const SOCKET_URL =
  "https://skribbl-clone-backend-m4du.onrender.com";

export const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  autoConnect: true,
});
```

---

# 🔄 Application Flow

```text
                Home
                 │
          ┌──────┴──────┐
          ▼             ▼
     Create Room     Join Room
          │             │
          └──────┬──────┘
                 ▼
               Lobby
                 │
           Host Starts Game
                 │
                 ▼
                Game
                 │
       ┌─────────┼─────────┐
       │         │         │
       ▼         ▼         ▼
    Drawing   Guessing    Chat
       │         │
       └────┬────┘
            ▼
        Round End
            │
            ▼
       Next Round
            │
            ▼
       Game Over
            │
            ▼
       Leaderboard
```

---

# 🌐 Deployment

The frontend is deployed using **Netlify**.

```text
GitHub
   │
   ▼
Netlify
   │
   ▼
React + Vite Frontend
   │
   │ Socket.IO
   ▼
Render
   │
   ▼
Node.js + Express + Socket.IO Backend
```

### Frontend

```text
https://skribbl-clone-by-riteshpathak.netlify.app
```

### Backend

```text
https://skribbl-clone-backend-m4du.onrender.com
```

---

# 🔀 React Router & Netlify

Because this application uses client-side React routing, Netlify needs to serve `index.html` for application routes.

The project includes:

```text
public/_redirects
```

with:

```text
/*    /index.html   200
```

This allows routes such as:

```text
/create-room
/join-room
/lobby
/game
/game-over
```

to work correctly when opened directly or refreshed.

---

# 💻 Running Locally

## 1. Clone the repository

```bash
git clone https://github.com/Adriguna/skribbl_clone_client.git
```

Move into the project:

```bash
cd skribbl_clone_client
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Start the development server

```bash
npm run dev
```

Vite will start the application, normally at:

```text
http://localhost:5173
```

---

# 📦 Available Scripts

The project currently provides these npm scripts:

### Development

```bash
npm run dev
```

Starts the Vite development server.

### Production Build

```bash
npm run build
```

Creates the production build.

### Lint

```bash
npm run lint
```

Runs ESLint.

### Preview

```bash
npm run preview
```

Previews the production build locally.

---

# 🔗 Backend Connection

The frontend requires the backend Socket.IO server to be running.

### Production

```text
https://skribbl-clone-backend-m4du.onrender.com
```

### Local Development

For local development, the Socket.IO client can connect to:

```text
http://localhost:5000
```

Make sure the backend is running before testing multiplayer functionality.

Backend repository:

https://github.com/Adriguna/skribbl_clone_backend

---

# 🧪 Testing Multiplayer

To test the multiplayer game locally or in production:

1. Open the application.
2. Create a room.
3. Copy the room code.
4. Open another browser window/device.
5. Join the same room.
6. Start the game from the host account.
7. Test drawing and guessing.
8. Verify chat and hints.
9. Verify score updates.
10. Continue through multiple rounds.
11. Verify the final leaderboard.

---

# 🎯 Core Game Features

The frontend supports the main multiplayer game flow:

* ✅ Create room
* ✅ Join room
* ✅ Room code
* ✅ Multiplayer lobby
* ✅ Host controls
* ✅ Turn-based drawing
* ✅ Real-time drawing
* ✅ Word selection
* ✅ Guessing
* ✅ Time-based scoring
* ✅ Progressive hints
* ✅ Real-time chat
* ✅ Timer
* ✅ Multiple rounds
* ✅ Drawer rotation
* ✅ Leaderboard
* ✅ Game-over screen
* ✅ Custom words
* ✅ Responsive interface

---

# 🔐 Git & Project Hygiene

The repository excludes dependencies and generated files such as:

```text
node_modules/
dist/
.env
```

Dependencies should be installed using:

```bash
npm install
```

rather than committing `node_modules` to Git.

---

# 👨‍💻 Author

**Ritesh Pathak**

B.Tech Computer Science Engineering

GitHub:

https://github.com/RiteshPathak-12

---

# 🔗 Project Links

### Frontend Repository

https://github.com/Adriguna/skribbl_clone_client

### Backend Repository

https://github.com/Adriguna/skribbl_clone_backend

### Live Application

https://skribbl-clone-by-riteshpathak.netlify.app

### Backend

https://skribbl-clone-backend-m4du.onrender.com

---

## ⭐ Project Summary

A real-time multiplayer drawing and guessing game built using:

**React + Vite + React Router + Socket.IO + HTML5 Canvas + Node.js + Express**

The frontend provides the complete interactive game experience while the backend manages multiplayer synchronization, rooms, game state, rounds, scoring, and real-time communication.
