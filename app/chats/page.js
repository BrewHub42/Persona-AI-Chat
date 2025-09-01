"use client";
import React, { useState } from "react";

export default function chats() {
  const [message, setMessage] = useState("");
  const [streaming, setStreaming] = useState("");
  const [streamResponse, setStreamResponse] = useState("");

  const handleStreamChat = async () => {
    // setLoading(true)
    setStreaming(true);
    setStreamResponse("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const reader = res.body.getReader();

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);

        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));

            setStreamResponse((prev) => prev + data.content);
          }
        }
      }
    } catch (error) {
      setStreamResponse("Error: " + error.message);
    }

    setStreaming(false);
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1>Get started with persona ai chat</h1>
      <div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your awesome message"
          rows={4}
          style={{ width: "100%", marginBottom: "10px" }}
        />
      </div>
      <div>
        <button
          onClick={handleStreamChat}
          style={{ padding: "10px 20px", backgroundColor: "orange" }}
        >
          {streaming ? "Loading..." : "Chat"}
        </button>
      </div>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          whiteSpace: "pre-wrap",
          fontSize: "28px"
        }}
      >
        {streamResponse}
      </div>
    </div>
  );
}
