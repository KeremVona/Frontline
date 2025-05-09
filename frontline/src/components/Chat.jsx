import React from "react";
import { useState, useEffect } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import "./Chat.css";

export default function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        sender: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);
  return (
    <>
      <div className="p-6 max-w-2xl mx-auto bg-gray-500 mt-4 shadow-md rounded-xl">
        <div>
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
            <legend className="fieldset-legend">Chat</legend>
            <input
              type="text"
              value={currentMessage}
              onChange={(event) => {
                setCurrentMessage(event.target.value);
              }}
              onKeyDown={(event) => {
                event.key === "Enter" && sendMessage();
              }}
              className="input"
              placeholder="Type something here..."
            />
            <p className="label">Please be respectful to others</p>
            <button onClick={sendMessage} className="btn btn-success">
              Send
            </button>
          </fieldset>
        </div>
      </div>
      <ScrollToBottom className="message-container" followButtonClassName="follow-button">
        {messageList.map((messageContent) => {
          return (
            <div className="p-6 max-w-2xl mx-auto bg-gray-500 mt-4 shadow-md rounded-xl">
              <div
                className={
                  username === messageContent.sender
                    ? "chat chat-end"
                    : "chat chat-start"
                }
              >
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS chat bubble component"
                      src="https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
                    />
                  </div>
                </div>
                <div className="chat-header">
                  {messageContent.sender}
                  <time className="text-xs opacity-50">
                    {messageContent.time}
                  </time>
                </div>
                <div className="chat-bubble">{messageContent.message}</div>
                <div className="chat-footer opacity-50">Delivered</div>
              </div>
            </div>
          );
        })}
      </ScrollToBottom>
    </>
  );
}
