import React, { useState } from "react";
import YouTubeIngest from "./components/YoutubeIngest";
import Chat from "./components/Chat";
import "./App.css";

function App() {
  const [videoId, setVideoId] = useState(null);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="youtube-icon">▶</span>
            YouTube Twin AI
          </h1>
          <p className="app-subtitle">Chat with your favorite YouTube videos</p>
        </div>
      </header>
      
      <main className="app-main">
        <YouTubeIngest videoId={videoId} setVideoId={setVideoId} />
        {videoId && <Chat videoId={videoId} />}
      </main>
    </div>
  );
}

export default App;
