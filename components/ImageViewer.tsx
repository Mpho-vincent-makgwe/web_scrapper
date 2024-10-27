import Image from 'next/image';
import React from 'react';

interface ImageViewerProps {
    imageSrc: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ imageSrc }) => {
    return (
        <div className="image-container">
            <Image
                src={imageSrc}
                alt="Scraped Image"
                width={1200} // Adjust width as needed
                height={800} // Adjust height as needed
                className="rounded-lg w-full"
                style={{ maxHeight: '600px', objectFit: 'contain' }} // Ensure the image fits nicely
                priority // Prioritize loading the image
            />

            {/* Download button for the image */}
            <div className="download-button mt-2">
                <a href={imageSrc} download className="text-blue-600 hover:underline">
                    Download Image
                </a>
            </div>
        </div>
    );
};

export default ImageViewer;
