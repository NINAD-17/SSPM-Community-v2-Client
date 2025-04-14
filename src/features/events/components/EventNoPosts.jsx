import React from 'react';
import postNotFound from "../../../assets/postNotFound.png";

const EventNoPosts = () => {
  return (
    <div className="w-full bg-white rounded-xl text-center p-10 mt-4 shadow">
      <img className="mx-auto my-auto w-80" src={postNotFound} alt="No posts found" />
      <h2 className="text-gray-300 font-semibold text-2xl">No posts available for this event</h2>
      <p className="text-gray-400 mt-2">Posts related to this event will appear here.</p>
    </div>
  );
};

export default EventNoPosts; 