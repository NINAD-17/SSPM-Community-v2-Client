import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createNewGroupPost } from "../groupsSlice";
import { toast } from "sonner";
import Dropzone from "../../../components/common/Dropzone";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import defaultAvatar from "../../../assets/user.png";

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

const CreateGroupPost = () => {
    const dispatch = useDispatch();    
    const user = useSelector((state) => state.user.user);
    const currentGroup = useSelector((state) => state.groups.currentGroup.data);
    const [isPostCreationOn, setIsPostCreationOn] = useState(false);
    const [content, setContent] = useState("");
    const [files, setFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const quillRef = useRef(null);

    const handleSubmit = async () => {
        if (!content.trim() && files.length === 0) {
            toast.error("Please write something or add media!");
            return;
        }

        setIsSubmitting(true);
        try {
            await dispatch(createNewGroupPost({
                groupId: currentGroup._id,
                postData: {
                    content,
                    media: files,
                    contentType: "richText"
                }
            })).unwrap();
            
            // Reset Form
            setContent("");
            setFiles([]);
            setIsPostCreationOn(false);
            toast.success("Post created successfully");
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
        <div className="bg-white shadow rounded-xl">
            {!isPostCreationOn ? (
                <div className="p-4">
                    <div className="flex items-center gap-4">
                        <img
                            src={user?.avatar || defaultAvatar}
                            alt="user"
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <button
                            onClick={() => setIsPostCreationOn(true)}
                            className="flex-1 text-left px-4 py-3 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                        >
                            Start a post in {currentGroup?.name}...
                        </button>
                    </div>
                    <div className="flex justify-between mt-3 px-4">
                        <button 
                            onClick={() => setIsPostCreationOn(true)}
                            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <span className="material-symbols-outlined text-blue-600">image</span>
                            <span className="text-gray-600">Media</span>
                        </button>
                        <button 
                            onClick={() => setIsPostCreationOn(true)}
                            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <span className="material-symbols-outlined text-green-600">article</span>
                            <span className="text-gray-600">Article</span>
                        </button>
                        <button 
                            onClick={() => setIsPostCreationOn(true)}
                            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <span className="material-symbols-outlined text-amber-600">event</span>
                            <span className="text-gray-600">Event</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <img
                            src={user?.avatar || defaultAvatar}
                            alt="user"
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                            <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                            <div className="flex items-center text-sm text-gray-500">
                                <span className="material-symbols-outlined text-base mr-1">group</span>
                                Posting in {currentGroup?.name}
                            </div>
                        </div>
                    </div>
                    
                    <div className="quill-wrapper mb-4">
                        <ReactQuill
                            ref={quillRef}
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            modules={quillModules}
                            formats={quillFormats}
                            placeholder="What do you want to share with the group?"
                            className="bg-white rounded-xl"
                        />
                    </div>

                    <Dropzone 
                        files={files} 
                        setFiles={setFiles}
                        validateFile={validateFile}
                        custCSS="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-blue-500 transition-colors"
                    />
                    
                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            onClick={() => setIsPostCreationOn(false)}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || (!content.trim() && files.length === 0)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? "Posting..." : "Post"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateGroupPost;
