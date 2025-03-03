import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createNewPost } from "../postsSlice";
import Dropzone from "../../../components/common/Dropzone";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from "sonner";
import defaultAvatar from "../../../assets/user.png"

const quillModules = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link'],
        ['clean']
    ]
};

const quillFormats = [
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link'
];

function CreatePostBox() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const [isPostCreationOn, setIsPostCreationOn] = useState(false);
    const [content, setContent] = useState("");
    const [files, setFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const quillRef = useRef(null);

    const handlePost = async () => {
        if (!content.trim() && files.length === 0) {
            toast.error("Please write something or add media!");
            return;
        }

        setIsSubmitting(true);
        try {
            await dispatch(createNewPost({ 
                content, 
                media: files,
                contentType: "richText"
            })).unwrap();
            
            // Reset form
            setContent("");
            setFiles([]);
            setIsPostCreationOn(false);
            toast.success("Post created successfully!");
        } catch (error) {
            toast.error(error || "Failed to create post");
        } finally {
            setIsSubmitting(false);
        }
    };

    const validateFile = (file) => {
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        const isPDF = file.type === 'application/pdf';
        
        if (!isImage && !isVideo && !isPDF) {
            toast.error("Only images, videos, and PDFs are allowed");
            return false;
        }

        if (isImage && files.filter(f => f.type.startsWith('image/')).length >= 5) {
            toast.error("Maximum 5 images allowed");
            return false;
        }

        if (isVideo && files.some(f => f.type.startsWith('video/'))) {
            toast.error("Only 1 video allowed");
            return false;
        }

        if (isPDF && files.some(f => f.type === 'application/pdf')) {
            toast.error("Only 1 PDF allowed");
            return false;
        }

        if (file.size > 50 * 1024 * 1024) { // 50MB
            toast.error("File size should be less than 50MB");
            return false;
        }

        return true;
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow">
            {!isPostCreationOn ? (
                <div 
                    className="flex items-center space-x-4 cursor-pointer"
                    onClick={() => setIsPostCreationOn(true)}
                >
                    <img
                        className="h-12 w-12 object-cover rounded-full "
                        src={user?.avatar || defaultAvatar}
                        alt=""
                    />
                    <div className="flex-1 bg-gray-100 rounded-full py-3 px-6 text-gray-500 hover:bg-gray-200">
                        Start a post...
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <img
                            className="h-12 w-12 object-cover rounded-full"
                            src={user?.avatar || defaultAvatar}
                            alt=""
                        />
                        <div>
                            <h4 className="font-semibold">
                                {user?.firstName} {user?.lastName}
                            </h4>
                            <p className="text-sm text-gray-500">{user?.headline}</p>
                </div>
            </div>
            
                    <div className="quill-wrapper">
                        <ReactQuill
                            ref={quillRef}
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            modules={quillModules}
                            formats={quillFormats}
                            placeholder="What do you want to talk about?"
                            className="bg-white rounded-xl"
                        />
                    </div>

                    <Dropzone 
                        files={files} 
                        setFiles={setFiles}
                        validateFile={validateFile}
                        custCSS="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-blue-500 transition-colors"
                    />

                    <div className="flex justify-end space-x-2 pt-4">
                        <button
                            className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 cursor-pointer"
                            onClick={() => setIsPostCreationOn(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className={`px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed ${isSubmitting && "cursor-not-allowed"}`}
                            onClick={handlePost}
                            disabled={isSubmitting || (!content.trim() && files.length === 0)}
                        >
                            {isSubmitting ? "Posting..." : "Post"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreatePostBox;