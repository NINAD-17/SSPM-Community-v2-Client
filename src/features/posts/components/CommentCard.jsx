import { useEffect, useState } from "react";
import { academicYearCalc } from "../../../utils/academicYear";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../state";
import { useNavigate } from "react-router-dom";


const CommentCard = ({ comment, postId }) => {
    console.log({comment, postId});

    const loggedInUser = useSelector((state) => state.user);
    const posts = useSelector((state) => state.posts);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [ commentUser, setCommentUser ] = useState(null);
    const commentContent = comment.comment;
    console.log(comment.userId);
    // const time = comment.timestamps;

    const fetchUserOfComment = async() => {
        const response = await fetch(`http://localhost:3000/users/${comment.userId}`, {
            method: "GET"
        });

        const user = await response.json();
        setCommentUser(user);
    }

    const handleDeleteButton = async () => {
      console.log({postId}, "from handle delete");
      const response = await fetch(`http://localhost:3000/posts/${postId}/${comment._id}/delete-comment`, {
        method: "DELETE",
      });

      if (response.status === 200) {
          const updatedPosts = posts.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              comments: post.comments.filter((c) => c._id !== comment._id),
            };
          }
          return post;
          });
          dispatch(setPosts({ posts: updatedPosts }));
        }
    }

    useEffect(() => {
      fetchUserOfComment();
    }, []);

    if(commentUser == null) return;
    // console.log(commentUser);

    return (
      <>
        <div className="bg-blue-50 flex px-2 py-2 rounded-xl my-3 relative">
          <img
            className="h-full w-8 rounded-xl"
            src={
              commentUser.picturePath
                ? commentUser.picturePath
                : "../../user.png"
            }
            alt=""
          />
          <div className="items-center ml-3">
            <div className="flex justify-between">
              <div className="space-x-2 flex text-sm">
                <h2
                  className="font-medium hover:underline hover:cursor-pointer"
                  onClick={() => navigate(`/profile/${commentUser._id}`)}
                >
                  {commentUser.firstName} {commentUser.lastName}
                </h2>
                {commentUser.status === "Student" ? (
                  <p className="text-slate-500">
                    Student - {academicYearCalc(commentUser.gradYear)} Year
                  </p>
                ) : (
                  <p className="text-slate-500">Alumni</p>
                )}
              </div>
              {/* <p className="text-sm text-slate-500">6h ago</p> */}
            </div>
            <p className="overflow-x-hidden text-slate-700 text-md py-0">
              {commentContent}
            </p>
          </div>
          {comment.userId === loggedInUser._id ? (
            <img
              className="w-3 h-3 absolute right-3 top-3 hover:cursor-pointer"
              src="../../cross.png"
              alt=""
              onClick={handleDeleteButton}
            />
          ) : (
            <></>
          )}
        </div>
      </>
    );
}

export default CommentCard