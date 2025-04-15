import React from 'react';
import darwin_sense from '../assets/darwin-sense-1-unscreen.gif'

const Loader = () => {
  return (
    <>
      <div className="absolute bg-gray-900 opacity-50 z-80 w-screen h-full" />
      <div className="absolute inset-0 flex justify-center items-center z-100">
        <div className="h-64 w-64 bg-white rounded-3xl">
          <img src={darwin_sense} alt="Loading..." />
        </div>
      </div>
    </>
  );
};

export default Loader;
