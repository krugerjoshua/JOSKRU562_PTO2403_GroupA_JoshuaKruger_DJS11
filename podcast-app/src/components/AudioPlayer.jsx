import React, { useRef, useState, useEffect } from "react";

function AudioPlayer({ src, episodeId, onComplete }) {
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Load saved progress once duration is known
  useEffect(() => {
    if (duration > 0) {
      const savedProgress = localStorage.getItem(`progress-${episodeId}`);
      if (savedProgress) {
        // Calculate percentage progress based on saved time and duration
        setProgress((parseFloat(savedProgress) / duration) * 100);
      }
    }
  }, [episodeId, duration]);

  // Update progress as the audio plays and save current time in localStorage
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const newProgress = (currentTime / duration) * 100;
      setProgress(newProgress);
      localStorage.setItem(`progress-${episodeId}`, currentTime);
    }
  };

  // When audio ends, mark episode as completed and set progress to 100%
  const handleEnded = () => {
    setProgress(100);
    // Retrieve current list of completed episodes from localStorage
    const completedEpisodes = JSON.parse(localStorage.getItem("completedEpisodes")) || [];
    if (!completedEpisodes.includes(episodeId)) {
      completedEpisodes.push(episodeId);
      localStorage.setItem("completedEpisodes", JSON.stringify(completedEpisodes));
    }
    if (onComplete) {
      onComplete(episodeId);
    }
  };

  // Allow user to seek in the audio
  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setProgress(e.target.value);
    }
  };

  // When metadata loads, set the duration and resume from saved time if available
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      const savedTime = localStorage.getItem(`progress-${episodeId}`);
      if (savedTime) {
        audioRef.current.currentTime = parseFloat(savedTime);
      }
    }
  };

  // Toggle play/pause and update state accordingly
  const togglePlay = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className="audio-player bg-gray-100 p-3 rounded-lg shadow-md flex items-center space-x-4">
      <button
        onClick={togglePlay}
        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
      >
        {isPlaying ? "⏸️" : "▶️"}
      </button>

      <input
        type="range"
        value={progress}
        onChange={handleSeek}
        className="flex-grow"
        min="0"
        max="100"
      />

      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
    </div>
  );
}

export default AudioPlayer;