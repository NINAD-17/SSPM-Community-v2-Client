import React from "react";
import { useSelector } from "react-redux";
import Layout from "../components/layout/Layout";
import Footer from "../components/layout/Footer";
import ProfileCard from "../features/profile/components/ProfileCard";
import Posts from "../features/posts/components/Posts";
import CreatePostBox from "../features/posts/components/CreatePostBox";

const HomePage = () => {
    const { user } = useSelector((state) => state.user);

    return (
        <Layout>
            <div className="bg-blue-50 grid sm:grid-cols-12 max-w-7xl mx-auto gap-3 p-2 sm:p-3 md:p-4 lg:p-5">
                <div className="sm:col-span-4 lg:col-span-3 rounded-xl">
                    {/* Left */}
                    <ProfileCard userId={user?._id} />
                    <div className="hidden sm:block">
                        <Footer />
                    </div>
                    {/* <FriendsList /> */}
                </div>
                <div className="sm:col-span-8 lg:col-span-6 rounded-xl">
                    {/* Middle */}
                    <CreatePostBox />
                    {/* <ThreeCard /> */}
                    <hr className="my-3 mx-6 border-blue-400" />
                    <div className="lg:block">
                        <Posts />
                    </div>
                </div>
                <div className="hidden lg:block lg:col-span-3 rounded-xl">
                    {/* Right */}
                    {/* <Groups />
                    <FriendsList userId={_id} /> */}
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;
