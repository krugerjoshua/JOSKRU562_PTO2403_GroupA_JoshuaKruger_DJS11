import React from "react";

function AudioPlayer({ src }) {
    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-center items-center">
            <audio controls className="w-full max-w-md outline-none">
                <source src={src} type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
        </div>
    );
}

export default AudioPlayer;
