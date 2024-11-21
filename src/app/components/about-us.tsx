import React from 'react';
import Image from 'next/image';

const AboutSection: React.FC = () => {
  return (
    <section id="about-us" className="px-6 lg:px-40 py-20 bg-white">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl text-blue-600 font-bold mb-4">Who we are</h2>
        <p className="text-lg text-gray-600 mb-12">
          We are a dedicated team committed to developing innovative solutions for flood rescue and recovery in Bangladesh, empowering communities and saving lives.
        </p>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-stretch gap-12">
          {/* Left Image + Text Block */}
          <div className="w-full lg:w-1/2 text-center flex flex-col">
            <div className="relative w-full h-64 mb-6">
              <Image
                src="/rescue-2.jpg" // Replace with your image path
                alt="Our Mission Image"
                fill
                className="object-cover rounded-lg shadow-md"
              />
            </div>
            <h3 className="text-2xl text-blue-950 font-semibold mb-4">Our Mission</h3>
            <p className="text-gray-600 text-justify">
              Our mission is to create a rescue system for the flood-affected people of Bangladesh, where millions suffer and lose everything due to flooding. Not only are lives at stake, but also billions of dollars in goods are damaged and abandoned as a result of inadequate flood management.
            </p>
          </div>

          {/* Right Image + Text Block */}
          <div className="w-full lg:w-1/2 text-center flex flex-col">
            <div className="relative w-full h-64 mb-6">
              <Image
                src="/rescue-1.jpg" // Replace with your image path
                alt="Our Story Image"
                fill
                className="object-cover rounded-lg shadow-md"
              />
            </div>
            <h3 className="text-2xl text-blue-950 font-semibold mb-4">Our Story</h3>
            <p className="text-gray-600 text-justify">
              In the heart of Dhaka, we gathered as passionate volunteers to create a website for a flood rescue system in Bangladesh. Our vision was clear: to connect those in need with vital resources.
              <br />
              We brainstormed features like real-time flood updates, a directory of local shelters, and a donation platform. Each of us contributed our unique skills—design, coding, and storytelling—to bring our idea to life.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
