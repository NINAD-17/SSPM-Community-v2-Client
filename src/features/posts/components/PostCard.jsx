import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removePost } from "../postsSlice";
import { calculateTimeAgo } from "../../../utils/calculateTimeAgo";
import { academicYearCalc } from "../../../utils/academicYear";
// import CommentCard from "./CommentCard";
import { toast } from "sonner";
import defaultAvatar from "../../../assets/user.png"

const MediaGallery = ({ media }) => {
    const [selectedImage, setSelectedImage] = useState(0);

    if (!media || media.length === 0) return null;

    const isPDF = media[0].endsWith('.pdf');
    const isVideo = media[0].match(/\.(mp4|webm)$/i);

    if (isPDF) {
        return (
            <div className="mt-4 border rounded-xl p-4 bg-gray-50">
                <div className="flex items-center space-x-2">
                    <span className="material-symbols-outlined text-red-500">picture_as_pdf</span>
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
                                    selectedImage === idx ? 'bg-blue-500' : 'bg-gray-300'
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
                                selectedImage === idx ? 'ring-2 ring-blue-500' : ''
                            }`}
                            onClick={() => setSelectedImage(idx)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

function PostCard({ post }) {
    const {
        _id: postId,
        userId,
        content,
        media,
        likesCount,
        commentsCount,
        isLiked,
        createdAt,
        userDetails
    } = post;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loggedInUser = useSelector((state) => state.user.user);
    const [isMoreVertOn, setIsMoreVertOn] = useState(false);

    const handleDelete = async () => {
        try {
            await dispatch(removePost(postId)).unwrap();
            toast.success("Post deleted successfully");
        } catch (error) {
            toast.error("Failed to delete post");
        }
    };

    return (
      <div className="bg-white p-6 shadow rounded-xl mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
                        className="h-12 w-12 rounded-full mr-2 object-cover cursor-pointer"
                        src={userDetails?.avatar || defaultAvatar}
              alt=""
                        onClick={() => navigate(`/profile/${userId}`)}
            />
                    <div>
              <div className="flex items-center">
                <h2
                  className="font-semibold text-md hover:underline cursor-pointer"
                                onClick={() => navigate(`/user/profile/${userId}`)}
                >
                                {`${userDetails?.firstName} ${userDetails?.lastName}`}
                </h2>
                            {userDetails?.role === "student" ? (
                  <span className="text-gray-400 text-sm ml-2 font-normal">
                                    {academicYearCalc(userDetails?.graduationYear)} Year
                  </span>
                ) : (
                  <span className="text-gray-400 text-sm ml-2 font-normal">
                                    Alumni - {userDetails?.graduationYear}
                  </span>
                )}
              </div>
                        <p className="text-gray-500 text-sm">
                            {calculateTimeAgo(createdAt)}
              </p>
            </div>
          </div>
                {userId === loggedInUser?._id && (
            <div className="relative">
                        <span
                            className="material-symbols-outlined cursor-pointer text-gray-500"
                onClick={() => setIsMoreVertOn(!isMoreVertOn)}
              >
                  more_vert
                </span>
                        {isMoreVertOn && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                <button
                                    className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                    onClick={handleDelete}
                                >
                                    Delete Post
                                </button>
            </div>
              )}
            </div>
          )}
        </div>

        <div className="my-3">
                <div 
                    className="description prose prose-blue max-w-none"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
                <MediaGallery media={media} />
          </div>

            <div className="flex justify-between items-center mt-4 text-gray-500">
                <div className="flex items-center space-x-2">
                    <span className="material-symbols-outlined">thumb_up</span>
                    <span>{likesCount}</span>
          </div>
                <div className="flex items-center space-x-2">
                    <span className="material-symbols-outlined">comment</span>
                    <span>{commentsCount}</span>
                </div>
            </div>
      </div>
    );
}

export default PostCard
