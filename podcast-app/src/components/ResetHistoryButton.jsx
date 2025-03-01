// ResetHistoryButton.jsx
import React from "react";

function ResetHistoryButton() {
  const handleResetListeningHistory = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset your entire listening history? This will remove all your progress and completed marks. This action cannot be undone."
    );
    if (confirmed) {
      // Remove all keys that start with "progress-"
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("progress-")) {
          localStorage.removeItem(key);
        }
      });
      // Remove the completed episodes data
      localStorage.removeItem("completedEpisodes");
      // Optionally, you can refresh the page or update app state to reflect changes
      window.location.reload();
      comsole.log("History Resetted ✅")
    }
  };

  return (
    <button
      onClick={handleResetListeningHistory}
      className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
    >
      Reset Listening History
    </button>
  );
}

export default ResetHistoryButton;
