import React from 'react';
import Link from 'next/link';
import { useState } from 'react';

import JSZip from 'jszip';
import VideoPlayer from '@/components/VideoPlayer';

export default function Home() {
    const [url, setUrl] = useState('');
    const [contentItems, setContentItems] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeVideo, setActiveVideo] = useState<string | null>(null);
    const [zipFileList, setZipFileList] = useState<string[]>([]);
    const [isUnzipped, setIsUnzipped] = useState<boolean>(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const getFileExtension = (url: string) => {
        return url.split('.').pop()?.toLowerCase();
    };

    const getContentType = (url: string) => {
        const extension = getFileExtension(url);
        if (extension) {
            if (['mp4', 'webm', 'avi', 'mov', 'ogg', 'wmv'].includes(extension)) {
                return 'video';
            } else if (['pdf', 'pptx', 'odt', 'ods', 'rtf'].includes(extension)) {
                return 'pdf';
            } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'ico', 'svg'].includes(extension)) {
                return 'image';
            } else if (extension === 'zip') {
                return 'zip';
            } else {
                return 'link';
            }
        }
        return 'link';
    };

    const handleScrape = async () => {
        setLoading(true);
        setError(null);
        setContentItems([]);

        try {
            const response = await fetch('/api/scrape', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            const data = await response.json();

            if (response.ok) {
                const categorizedContent = data.urls.map((url: string) => ({
                    url,
                    type: getContentType(url),
                }));
                setContentItems(categorizedContent);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to scrape the website');
        } finally {
            setLoading(false);
        }
    };

    const handleZipExtraction = async (zipSrc: string) => {
        if (!zipSrc) {
            setError('No ZIP source provided.');
            return;
        }
        setError(null);
        setLoading(true);
        try {
            const response = await fetch(zipSrc);
            const blob = await response.blob();
            const zip = await JSZip.loadAsync(blob);

            const files: string[] = [];
            zip.forEach((relativePath) => {
                files.push(relativePath);
            });

            if (files.length === 0) {
                setError('No files found in the ZIP.');
            } else {
                setZipFileList(files);
                setIsUnzipped(true);
            }
        } catch (err) {
            setError('Failed to extract ZIP contents');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-400 flex flex-col items-center py-8">
            <h1 className="text-4xl font-bold mb-8">Web Scraper</h1>
            <div className="flex space-x-4 mb-6">
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter URL to scrape"
                    className="px-4 py-2 border border-gray-300 rounded-lg w-96"
                />
                <button
                    onClick={handleScrape}
                    disabled={loading}
                    className={`px-4 py-2 text-white rounded-lg transition-colors duration-200 ease-in-out ${loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {loading ? 'Scraping...' : 'Scrape'}
                </button>
            </div>

            {error && <p className="text-red-500 mb-4">Error: {error}</p>}

            {contentItems.length > 0 && (
                <div className="w-full max-w-4xl">
                    <h2 className="text-2xl font-semibold mb-4">Scraped Content:</h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {contentItems.map((item, index) => {
                            

                            return (
                                <li key={index} className="bg-white rounded-lg shadow-md p-4">
                                    {item.type === 'video' ? (
                                        <div>
                                            <button
                                                onClick={() => {
                                                    // Toggle video playback
                                                    setActiveVideo(activeVideo === item.url ? null : item.url);
                                                }}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {activeVideo === item.url ? 'Close Video' : 'View Video'}
                                            </button>
                                            {activeVideo === item.url && <VideoPlayer videoSrc={item.url} />}
                                        </div>
                                    ) : item.type === 'pdf' ? (
                                        <div className="pdf-container">
                                            <embed
                                                src={item.url}
                                                type="application/pdf"
                                                width="100%"
                                                height="600"
                                                className="rounded-lg"
                                                onError={() => setError('Error loading PDF.')}
                                            />
                                            <div className="download-button mt-2">
                                                <Link href={item.url} download className="text-blue-600 hover:underline">
                                                    Download PDF
                                                </Link>
                                            </div>
                                        </div>
                                    ) : item.type === 'image' ? (
                                        <div className="image-container">
                                            {!imageLoaded && (
                                                <div className="flex justify-center items-center h-60 bg-gray-200 rounded-lg">
                                                    {/* Placeholder while loading */}
                                                    <p>Loading...</p>
                                                </div>
                                            )}
                                            <img
                                                src={item.url}
                                                alt="Scraped Image"
                                                width={500} // Set a fixed width
                                                height={300} // Set a fixed height
                                                className={`rounded-lg w-full ${imageLoaded ? '' : 'hidden'}`} // Hide until loaded
                                                style={{ maxHeight: '300px', objectFit: 'contain' }} // Ensure the image fits nicely
                                                onLoad={() => setImageLoaded(true)} // Set loaded state on load
                                                onError={() => setError('Error loading image.')} // Handle error
                                            />
                                            <div className="download-button mt-2">
                                                <Link href={item.url} download className="text-blue-600 hover:underline">
                                                    Download Image
                                                </Link>
                                            </div>
                                        </div>
                                    ) : item.type === 'zip' ? (
                                        <div>
                                            <button
                                                onClick={() => handleZipExtraction(item.url)}
                                                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg mt-2"
                                            >
                                                📦 Load ZIP Contents
                                            </button>
                                            {isUnzipped && zipFileList.length > 0 && (
                                                <div className="mt-4">
                                                    <h3 className="text-lg font-semibold">Files in ZIP:</h3>
                                                    {zipFileList.map((file, fileIndex) => (
                                                        <div key={fileIndex} className="mt-2">
                                                            <Link
                                                                href={`${item.url}/${file}`}
                                                                download
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                {file}
                                                            </Link>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {loading && <p>Loading ZIP contents...</p>}
                                            {error && <p className="text-red-500 mt-2">{error}</p>}
                                        </div>
                                    ) : (
                                        <Link href={item.url} target="_blank" rel="noopener noreferrer">
                                            <p className="block mt-2 text-blue-600 hover:underline cursor-pointer">
                                                {item.url}
                                            </p>
                                        </Link>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
