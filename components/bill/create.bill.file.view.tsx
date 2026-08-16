"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

const Document = dynamic(
    () => import("react-pdf").then((mod) => mod.Document),
    {
        ssr: false,
    },
);
const Page = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
    ssr: false,
});

const CreateBillFileView = ({ file }: { file: File | null }) => {
    const [pdfReady, setPdfReady] = useState(false);

    const [width, setWidth] = useState(0);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const url = useMemo(
        () => (file ? URL.createObjectURL(file) : null),
        [file],
    );

    useEffect(() => {
        let mounted = true;

        const setupPdfWorker = async () => {
            const { pdfjs } = await import("react-pdf");
            pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

            if (mounted) {
                setPdfReady(true);
            }
        };

        setupPdfWorker();

        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        return () => {
            if (url) {
                URL.revokeObjectURL(url);
            }
        };
    }, [url]);

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
            ) : !pdfReady ? (
                <div>Loading PDF viewer...</div>
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
