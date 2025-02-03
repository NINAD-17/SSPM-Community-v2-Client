import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const Dropzone = ({ files, setFiles, validateFile, custCSS = null }) => {
    const onDrop = useCallback((acceptedFiles) => {
        const validFiles = acceptedFiles.filter(file => validateFile(file));
        if (validFiles.length) {
            setFiles((previousFiles) => [
                ...previousFiles,
                ...validFiles.map((file) =>
                    Object.assign(file, { preview: URL.createObjectURL(file) })
                ),
            ]);
        }
    }, [setFiles, validateFile]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
            'video/*': ['.mp4'],
            'application/pdf': ['.pdf']
        }
    });

    const removeFile = (name) => {
        setFiles((files) => files.filter((file) => file.name !== name));
    };

    return (
        <div>
            <div
                {...getRootProps()}
                className={custCSS || "border-2 border-dashed border-gray-300 rounded-xl p-4"}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className="text-center text-gray-500">Drop files here...</p>
                ) : (
                    <p className="text-center text-gray-500">
                        Drag & drop files here, or click to select files
                    </p>
                )}
            </div>

            <ul className="mt-4 space-y-2">
                {files.map((file) => (
                    <li key={file.name} className="relative">
                        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                            {file.type.startsWith("image/") && (
                                <img
                                    src={file.preview}
                                    className="h-12 w-12 object-cover rounded"
                                    onLoad={() => {
                                        URL.revokeObjectURL(file.preview);
                                    }}
                                    alt=""
                                />
                            )}
                            <span className="flex-1 text-sm text-gray-700">
                                {file.name}
                            </span>
                            <button
                                type="button"
                                className="text-gray-400 hover:text-red-500"
                                onClick={() => removeFile(file.name)}
                            >
                                <span className="material-symbols-outlined">
                                    delete
                                </span>
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dropzone;
