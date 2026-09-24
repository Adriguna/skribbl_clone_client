import { useEffect, useState } from "react";
import { socket } from "../services/socket";

function Chat() {
  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  useEffect(() => {
    const handleMessage = (data) => {
      setMessages((previous) => [
        ...previous,
        data,
      ]);
    };

    socket.on(
      "chat_message",
      handleMessage
    );

    return () => {
      socket.off(
        "chat_message",
        handleMessage
      );
    };
  }, []);

  const sendMessage = () => {
    const trimmed =
      message.trim();

    if (!trimmed) {
      return;
    }

    socket.emit("chat", {
      message: trimmed,
    });

    setMessage("");
  };

  const sendGuess = () => {
    const trimmed =
      message.trim();

    if (!trimmed) {
      return;
    }

    socket.emit("guess", {
      guess: trimmed,
    });

    setMessage("");
  };

  return (
    <div className="chat-box">

      <h3>Chat</h3>

      <div className="messages">

        {messages.map(
          (item, index) => (
            <div key={index}>

              <strong>
                {item.playerName}
              </strong>

              : {item.message}

            </div>
          )
        )}

      </div>

      <div>

        <input
          value={message}
          onChange={(e) =>
            setMessage(
              e.target.value
            )
          }
          onKeyDown={(e) => {
            if (
              e.key === "Enter"
            ) {
              sendGuess();
            }
          }}
          placeholder="Type your guess..."
        />

        <button
          onClick={sendGuess}
        >
          Guess
        </button>

        <button
          onClick={sendMessage}
        >
          Chat
        </button>

      </div>

    </div>
  );
}

export default Chat;