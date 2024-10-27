import React, { useState } from 'react';
import Link from 'next/link';

interface PDFViewerProps {
    pdfSrc?: string; // Mark as optional
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfSrc = '' }) => { // Default to empty string
    const [error, setError] = useState<boolean>(false);

    const handlePDFError = () => {
        setError(true);
    };

    return (
        <div className="pdf-container">
            {pdfSrc ? (
                <embed
                    src={pdfSrc}
                    type="application/pdf"
                    width="100%"
                    height="600"
                    onError={handlePDFError}
                    className="rounded-lg"
                />
            ) : (
                <p className="text-red-500 mt-2">No PDF source provided.</p>
            )}
            {error && <p className="text-red-500 mt-2">Error loading PDF. Please try again later.</p>}
            <div className="download-button mt-2">
                {pdfSrc && (
                    <Link href={pdfSrc} download className="text-blue-600 hover:underline">
                        Download PDF
                    </Link>
                )}
            </div>
        </div>
    );
};

export default PDFViewer;
