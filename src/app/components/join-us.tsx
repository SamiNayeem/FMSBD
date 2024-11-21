'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
const volunteerIconPath = '/joinus.png'; // Replace with the actual path to the volunteer icon image

const JoinUs: React.FC = () => {
  const router = useRouter();
  const handleSignUp = () => {
    router.push('/volunteer-registration');
  }
  return (
    <section id="join" className="py-16 bg-gray-100">
      <div className="container mx-auto px-6 lg:px-12 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-blue-600">Join Us</h2>
        <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto mb-8">
          We are looking for compassionate and dedicated volunteers to support our mission of providing life-saving aid to flood-affected communities. Join our team and help us make a difference in the lives of those impacted by flooding. Every action counts!
        </p>

        {/* Volunteer Icon */}
        <div className="flex justify-center mb-8">
          <Image
            src={volunteerIconPath}
            alt="Volunteer Icon"
            width={150}
            height={150}
            className="rounded-full shadow-lg"
          />
        </div>

        <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto mb-8">
          Whether it's distributing relief supplies, assisting with evacuations, or providing emotional support, your role as a volunteer can bring hope and relief to those in need. Join us in this important work and help make a real impact.
        </p>

        <div className="mt-6">
          <a
            href="#"
            className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition-colors" onClick={handleSignUp}
          >
            Sign Up as a Volunteer
          </a>
        </div>
      </div>
    </section>
  );
};

export default JoinUs;
