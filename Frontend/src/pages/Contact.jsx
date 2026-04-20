import React, { useState } from "react";
import Navbar from "../components/Navbar";

export default function Contact() {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message submitted successfully!");
    setMessage("");
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: "40px 20px", textAlign: "center" }}>
        <h2>Contact Us 💬</h2>
        <p>Have feedback or questions? Send us a message below!</p>
        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          <textarea
            rows="5"
            style={{ width: "300px", padding: "10px", borderRadius: "8px" }}
            placeholder="Enter your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <br />
          <button
            type="submit"
            style={{
              backgroundColor: "#0077b6",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
