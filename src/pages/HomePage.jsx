import { useState } from "react";
import { useSelector } from "react-redux";
import Layout from "../components/layout/Layout";
import Footer from "../components/layout/Footer";
import ProfileCard from "../features/profile/components/ProfileCard";
import Posts from "../features/posts/components/Posts";
import CreatePostBox from "../features/posts/components/CreatePostBox";
import JoinedGroups from "../features/groups/components/JoinedGroups";
import MyConnections from "../features/connections/components/MyConnections";
import MobileTabNavigation from "../components/common/MobileTabNavigation";

const HomePage = () => {
    const { user } = useSelector((state) => state.user);
    const [mobileTab, setMobileTab] = useState('feed');

    const handleTabChange = (tab) => {
        setMobileTab(tab);
    };

    const renderMobileContent = () => {
        switch(mobileTab) {
            case 'connections':
                return <MyConnections limit={10} />;
            case 'groups':
                return <JoinedGroups limit={10} />;
            case 'feed':
            default:
                return (
                    <>
                        <CreatePostBox />
                        <hr className="my-3 mx-6 border-blue-400" />
                        <Posts />
                    </>
                );
        }
    };

    return (
        <Layout>
            <div className="bg-blue-50 max-w-7xl mx-auto gap-3 p-2 sm:p-3 md:p-4 lg:p-5">
                {/* Mobile Tab Navigation */}
                <MobileTabNavigation onTabChange={handleTabChange} />
                
                <div className="grid sm:grid-cols-12 gap-3">
                    {/* Left Sidebar */}
                    <div className="sm:col-span-4 lg:col-span-3 hidden sm:block">
                        <ProfileCard userId={user?._id} />
                        <MyConnections />
                        <div className="mt-4">
                            <Footer />
                        </div>
                    </div>
                    
                    {/* Main Content - For both mobile and desktop */}
                    <div className="sm:col-span-8 lg:col-span-6">
                        {/* Mobile Content */}
                        <div className="sm:hidden">
                            {renderMobileContent()}
                        </div>
                        
                        {/* Desktop Content */}
                        <div className="hidden sm:block">
                            <CreatePostBox />
                            <hr className="my-3 mx-6 border-blue-400" />
                            <Posts />
                        </div>
                    </div>
                    
                    {/* Right Sidebar */}
                    <div className="hidden lg:block lg:col-span-3">
                        <JoinedGroups />
                    </div>
                </div>
                
                {/* Footer for Mobile */}
                <div className="sm:hidden mt-6">
                    <Footer />
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;
