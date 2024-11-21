import React from "react";
// import './Preloader.css'; // Assuming you keep custom CSS for the loader

const Preloader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="cssloader">
        <div className="triangle1"></div>
        <div className="triangle2"></div>
      </div>
      <p className="text text-gray-500 text-center font-medium tracking-wider mt-6">
        Please Wait
      </p>
    </div>
  );
};

export default Preloader;
