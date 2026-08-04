"use client";

import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const CreateBillFileView = ({ file }: { file: File | null }) => {
    const [url, setUrl] = useState<string | null>(null);

    const [width, setWidth] = useState(0);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!file) {
            setUrl(null);
            return;
        }
        const objectUrl = URL.createObjectURL(file);
        setUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    useEffect(() => {
        if (!url || !containerRef.current) {
            return;
        }

        setWidth(containerRef.current.getBoundingClientRect().width);

        const resizeObserver = new ResizeObserver((entries) => {
            if (entries[0]) {
                setWidth(entries[0].contentRect.width);
            }
        });

        resizeObserver.observe(containerRef.current);

        return () => resizeObserver.disconnect();
    }, [url]);

    return (
        <div ref={containerRef}>
            {!url ? (
                <div>No PDF selected</div>
            ) : (
                <Document
                    file={url}
                    loading="Loading PDF..."
                    error="Failed to load PDF"
                >
                    <Page pageNumber={1} width={width} />
                </Document>
            )}
        </div>
    );
};

export default CreateBillFileView;
