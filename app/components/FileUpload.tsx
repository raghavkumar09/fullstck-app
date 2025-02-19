"use client";
import React, { useState } from "react";
import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2 } from "lucide-react";

interface FileUploadProps {
    onSuccess: (res: IKUploadResponse) => void;
    onProgress?: (progress: number) => void;
    fileType?: "image" | "video";
}

export default function Fileupload({
    onSuccess,
    onProgress,
    fileType
}: FileUploadProps) {
    const [fileUpload, setFileUpload] = useState(false);
    const [error, setError] = useState<string | null>(null)

    const onError = (err: { message: string }) => {
        console.log("Error", err);
        setError(err.message);
        setFileUpload(false);
    };

    const handleSuccess = (res: IKUploadResponse) => {
        console.log("Success", res);
        setError(null);
        setFileUpload(false);
        onSuccess(res);
    };

    const handleProgress = (evt: ProgressEvent) => {
        if (evt.lengthComputable && onProgress) {
            const precetileCompute = (evt.loaded / evt.total) * 100;
            onProgress(Math.round(precetileCompute))
        }
    };

    const handleStartUpload = () => {
        setFileUpload(true);
        setError(null);
    };

    const validateFile = (file: File) => {
        if (fileType === "video") {
            if (!file.type.startsWith("video/")) {
                setError("Please upload your video file")
                return false
            }
            if (file.size > 100 * 1024 * 1024) {
                setError("File type must be less than 100 MB");
                return false
            }
        } else {
            const validFileTypes = ["image/jpeg", "image/png", "image/webp"]
            if (!validFileTypes.includes(file.type)) {
                setError("File type must be (JPEG, PNG, WEBP)")
                return false
            }
            if (file.size > 5 * 1024 * 1024) {
                setError("File type must be less than 5 MB");
                return false
            }
        }
        return false

    }

    return (
        <div className="space-y-2">
            <IKUpload
                fileName="test-upload.jpg"
                useUniqueFileName={true}
                responseFields={["tags"]}
                validateFile={validateFile}
                accept={fileType === "video" ? "video/*" : "image/*"}
                onError={onError}
                onSuccess={handleSuccess}
                onUploadProgress={handleProgress}
                onUploadStart={handleStartUpload}
                className="file-input file-input-bordered w-full"
                folder={fileType === "video" ? "/videos" : "/images"}
            />
            {
                fileUpload && (
                    <div className="flex items-center gap-2 text-sm text-primary">
                        <Loader2 className="animate-spin w-4 h-4" />
                        <span>Uploading.....</span>
                    </div>
                )
            }
            {
                error && (
                    <div className="text-error text-sm">
                        {error}
                    </div>
                )
            }
        </div>
    );
}