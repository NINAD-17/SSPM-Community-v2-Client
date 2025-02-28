import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProfileCard from "../features/profile/components/ProfileCard";
import ProfileInfo from "../features/profile/components/ProfileInfo";
import { clearProfile, fetchUserProfile } from "../features/profile/profileSlice";
import Layout from "../components/layout/Layout";
import Posts from "../features/posts/components/Posts";
import Spinner from "../components/common/Spinner";
// import FriendsList from "../../components/FriendsList";
// import CreatePostBox from "../../components/CreatePostBox";
// import ThreeCard from "../../components/ThreeCard";

const ProfilePage = () => {
    const { userId } = useParams();
    const dispatch = useDispatch();
    const loggedInUser = useSelector((state) => state.user);
    const profile = useSelector((state) => state.profile.profile);
    const profileStatus = useSelector((state) => state.profile.status);
    const navigate = useNavigate();
   
    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const response = await fetchUserProfile(userId);
                if (!response.data.user) {
                    navigate('/not-found');
                    return;
                }
                dispatch(fetchUserProfile(userId));
            } catch (error) {
                if (error.response?.status === 404) {
                    navigate('/not-found');
                } else {
                    // handle other errors
                }
            }
        };

        loadUserProfile();

        return () => {
            dispatch(clearProfile());
        };
    }, [userId, dispatch, navigate]);

    if(!profile) {
        return <Spinner />;
    }

    return (
        <Layout>
            <div className="mt-16  bg-blue-50 grid sm:grid-cols-12 mx-auto max-w-7xl gap-3 p-3 sm:p-3 md:p-4 lg:px-24 xl:px-36">
                <div className="sm:col-span-5 md:col-span-4 rounded-xl">
                    <ProfileCard userId={userId} />
                    <div className="hidden lg:block">
                        {/* <FriendsList userId={userId} /> */}
                    </div>
                </div>
                <div className="sm:col-span-7 md:col-span-8">
                    <ProfileInfo userId={userId} />
                    <Posts userId={userId} isProfile={true} />
                    {/* {userId === loggedInUser._id ? (
                            <CreatePostBox />
                        ) : (
                            <></>
                        )} */}
                    {/* <ThreeCard page={"profile"} /> */}
                    <div className="lg:hidden">
                        {/* {mobContent === "friends" ? (
                                <FriendsList userId={userId} />
                            ) : (
                                <Posts userId={userId} isProfile={true} />
                            )} */}
                    </div>
                    <div className="hidden lg:block">
                        {/* <Posts userId={userId} isProfile={true} /> */}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProfilePage;
