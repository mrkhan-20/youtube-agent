import React, { useState } from "react";
import { ingestVideo } from "../services/api";

const YouTubeIngest = ({ videoId, setVideoId }) => {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleIngest = async () => {
    if (!url.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    setError("");
    setStatus("");
    setLoading(true);

    try {
      const resp = await ingestVideo(url);
      setVideoId(resp.data.video_id);
      setStatus(`✓ Video processed successfully! ${resp.data.chunks} chunks created.`);
    } catch (err) {
      setError(err.response?.data?.detail || "Error processing video. Please try again.");
      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setVideoId(null);
    setUrl("");
    setStatus("");
    setError("");
  };

  return (
    <div className="ingest-container">
      <div className="ingest-card">
        <div className="ingest-header">
          <h2 className="ingest-title">
            <span className="icon">📹</span>
            Load YouTube Video
          </h2>
          {videoId && (
            <button className="reset-btn" onClick={handleReset} title="Load a different video">
              ↻ Reset
            </button>
          )}
        </div>
        
        <div className="ingest-input-group">
          <div className="input-wrapper">
            <input
              className={`ingest-input ${error ? "error" : ""}`}
              type="text"
              placeholder="Paste YouTube URL here (e.g., https://www.youtube.com/watch?v=...)"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleIngest()}
              disabled={loading || !!videoId}
            />
            {url && !videoId && (
              <button
                className="clear-btn"
                onClick={() => {
                  setUrl("");
                  setError("");
                }}
                title="Clear"
              >
                ×
              </button>
            )}
          </div>
          <button
            className={`ingest-btn ${loading ? "loading" : ""}`}
            onClick={handleIngest}
            disabled={loading || !!videoId || !url.trim()}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : videoId ? (
              "✓ Processed"
            ) : (
              "Create Agent"
            )}
          </button>
        </div>

        {error && (
          <div className="status-message error-message">
            <span className="error-icon">⚠</span>
            {error}
          </div>
        )}

        {status && (
          <div className="status-message success-message">
            <span className="success-icon">✓</span>
            {status}
          </div>
        )}

        {videoId && (
          <div className="video-info">
            <div className="video-id-badge">
              Video ID: <code>{videoId}</code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeIngest;
