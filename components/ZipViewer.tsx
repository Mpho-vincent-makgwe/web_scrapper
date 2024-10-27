import React, { useState } from 'react';
import JSZip from 'jszip';
import Link from 'next/link';

interface ZipViewerProps {
    zipSrc?: string; // Mark as optional
}

const ZipViewer: React.FC<ZipViewerProps> = ({ zipSrc = '' }) => { // Default to empty string
    const [fileList, setFileList] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isUnzipped, setIsUnzipped] = useState<boolean>(false);

    const handleZipExtraction = async () => {
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
                setFileList(files);
                setIsUnzipped(true);
            }
        } catch (err) {
            setError('Failed to extract ZIP contents');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="zip-viewer-container">
            {!isUnzipped ? (
                <button
                    onClick={handleZipExtraction}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    📦 Load ZIP Contents
                </button>
            ) : (
                <div>
                    <h3 className="text-lg font-semibold mt-4">Files in ZIP:</h3>
                    {loading && <p>Loading...</p>}
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    {fileList.length > 0 && (
                        <div className="mt-4">
                            {fileList.map((file, index) => (
                                <div key={index} className="mt-2">
                                    <Link
                                        href={`${zipSrc}/${file}`}
                                        download
                                        className="text-blue-600 hover:underline"
                                    >
                                        {file}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ZipViewer;
