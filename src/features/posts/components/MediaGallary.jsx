import { useState } from "react";

const MediaGallery = ({ media }) => {
    const [selectedImage, setSelectedImage] = useState(0);

    if (!media || media.length === 0) return null;

    const isPDF = media[0].endsWith(".pdf");
    const isVideo = media[0].match(/\.(mp4|webm)$/i);

    if (isPDF) {
        return (
            <div className="mt-4 border rounded-xl p-4 bg-gray-50">
                <div className="flex items-center space-x-2">
                    <span className="material-symbols-outlined text-red-500">
                        picture_as_pdf
                    </span>
                    <a
                        href={media[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        View PDF
                    </a>
                </div>
                <iframe
                    src={`${media[0]}#view=FitH`}
                    className="w-full h-[400px] mt-2 rounded-lg"
                    title="PDF Preview"
                />
            </div>
        );
    }

    if (isVideo) {
        return (
            <div className="mt-4">
                <video
                    controls
                    className="w-full rounded-xl"
                    poster={`${media[0]}#t=0.5`}
                >
                    <source src={media[0]} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        );
    }

    // Images
    return (
        <div className="mt-4">
            <div className="relative">
                <img
                    src={media[selectedImage]}
                    alt=""
                    className="w-full rounded-xl object-cover max-h-[600px]"
                />
                {media.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {media.map((_, idx) => (
                            <button
                                key={idx}
                                className={`w-2 h-2 rounded-full ${
                                    selectedImage === idx
                                        ? "bg-blue-500"
                                        : "bg-gray-300"
                                }`}
                                onClick={() => setSelectedImage(idx)}
                            />
                        ))}
                    </div>
                )}
            </div>
            {media.length > 1 && (
                <div className="flex mt-2 space-x-2 overflow-x-auto">
                    {media.map((url, idx) => (
                        <img
                            key={idx}
                            src={url}
                            alt=""
                            className={`h-20 w-20 rounded-lg cursor-pointer object-cover ${
                                selectedImage === idx
                                    ? "ring-2 ring-blue-500"
                                    : ""
                            }`}
                            onClick={() => setSelectedImage(idx)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MediaGallery