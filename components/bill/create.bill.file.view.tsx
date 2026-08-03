"use client";

import { useState, useEffect } from "react";

const CreateBillFileView = ({ file }: { file: File | null }) => {
    const [url, setUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!file) {
            setUrl(null);
            return;
        }
        const objectUrl = URL.createObjectURL(file);
        setUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    if (!url) return <div>No PDF selected</div>;

    return (
        <iframe
            src={url}
            title="Bill PDF preview"
            className="w-full h-full rounded border"
        />
    );
};

export default CreateBillFileView;
