'use client'
import React from 'react';
import Image from 'next/image';

const HeroSection: React.FC = () => {
  const RedirectLogin = () => {
    window.location.href = '/login';
  };
  return (
    <section className="relative h-[65vh] md:h-[75vh] lg:h-[85vh] mt-20">
      {/* Overlay */}
      <div className="absolute inset-0 bg-opacity-50 rounded-bl-[4rem] md:rounded-bl-[6rem] lg:rounded-bl-[8rem]"></div>
      
      <div
        className="container h-full relative mx-auto flex flex-col lg:flex-row items-center justify-center lg:justify-between px-4 md:px-6 lg:px-12 rounded-bl-[4rem] md:rounded-bl-[6rem] lg:rounded-bl-[8rem] bg-[url('/HeroImage.jpg')] bg-center bg-cover bg-no-repeat w-full"
        // style={{
        //   backgroundImage: "url('/HeroImage.jpg')", // Replace with the path to your background image
        //   backgroundSize: 'cover',
        //   backgroundPosition: 'center',
        // }}
      >
        {/* Text Content */}
        <div className="max-w-md md:max-w-lg lg:max-w-xl lg:text-left text-center lg:mr-8 z-10 p-4 md:p-6 lg:p-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white shadow-md bg-black bg-opacity-50">
            Rescue Flood Victims in Bangladesh
          </h1>
          <p className="mt-4 text-base md:text-lg text-gray-200 bg-black bg-opacity-50">
            Join hands to provide immediate support and resources to those affected by the floods.
          </p>
          <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center lg:justify-start">
            <button className="bg-black text-white py-2 px-4 md:py-3 md:px-6 rounded-lg font-semibold hover:bg-gray-800">
              Get Involved
            </button>
            <button className="bg-blue-700 text-white py-2 px-4 md:py-3 md:px-6 rounded-lg font-semibold hover:bg-blue-800" onClick={RedirectLogin}>
              Report an Incident
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
