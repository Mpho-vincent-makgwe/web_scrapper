import React, { useRef, useState } from 'react';

interface VideoPlayerProps {
    videoSrc: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoSrc }) => {
    const videoRef = useRef<HTMLVideoElement>(null); // Reference to the video element
    const [error, setError] = useState<boolean>(false); // State to track if there's an error

    console.log("video url:", videoSrc);
    const videoType = videoSrc.split('.').pop()?.toLowerCase(); // Extract the file extension
    console.log("video type:", videoType);

    const handleVideoError = () => {
        setError(true); // Set error state if the video fails to load
    };

    return (
        <div className="video-container">
            <video
                ref={videoRef}
                controls
                width="100%"
                className="rounded-lg"
                preload="metadata"
                onError={handleVideoError} // Attach error handler
            >
                {/* Include multiple sources for different formats */}
                {videoType === 'mp4' && <source src={videoSrc} type="video/mp4" />}
                {videoType === 'ogg' && <source src={videoSrc} type="video/ogg" />}
                {videoType === 'webm' && <source src={videoSrc} type="video/webm" />}
                {videoType === 'mov' && <source src={videoSrc} type="video/quicktime" />}
                {videoType === 'avi' && <source src={videoSrc} type="video/x-msvideo" />}
                {videoType === 'wmv' && <source src={videoSrc} type="video/x-ms-wmv" />}
                {/* Fallback for unsupported formats */}
                Your browser does not support the video tag.
            </video>

            {/* Error Message */}
            {error && <p className="text-red-500 mt-2">Error loading video. Please try again later.</p>}

            {/* Download button for the video */}
            <div className="download-button mt-2">
                <a href={videoSrc} download className="text-blue-600 hover:underline">
                    Download Video
                </a>
            </div>
        </div>
    );
};

export default VideoPlayer;
