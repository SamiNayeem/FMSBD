'use client';

import React from 'react';

const FloodPrecautionsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-white to-green-100 p-6 mt-20">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <header className="bg-blue-500 text-white py-6 px-4">
          <h1 className="text-2xl font-bold text-center">Flood Safety Guide</h1>
          <p className="text-center text-sm mt-2">
            Essential precautions and aftereffects for Bangladeshi people
          </p>
        </header>

        <main className="p-6 space-y-8">
          {/* Precautions Section */}
          <section>
            <h2 className="text-xl font-semibold text-blue-600">Precautions During a Flood</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                Stay informed through reliable sources such as <b>Bangladesh Meteorological Department</b> or local authorities.
              </li>
              <li>
                Keep an emergency kit ready with essentials like <b>food, water, flashlight, batteries, and first-aid supplies</b>.
              </li>
              <li>Move to higher ground if you live in flood-prone areas.</li>
              <li>
                Store important documents in waterproof bags or containers.
              </li>
              <li>
                Turn off gas, electricity, and water supplies before evacuating.
              </li>
              <li>
                Avoid walking or driving through floodwaters, as just <b>six inches</b> of water can knock you down.
              </li>
            </ul>
          </section>

          {/* Aftereffects Section */}
          <section>
            <h2 className="text-xl font-semibold text-green-600">Aftereffects of a Flood</h2>
            <p className="text-gray-700 mb-4">
              Floods can cause widespread destruction. Here are some key effects to consider:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                **Health risks**: Contaminated water can lead to diseases like <b>cholera, dengue, and skin infections</b>.
              </li>
              <li>
                **Loss of property**: Floodwaters may damage homes, crops, and infrastructure.
              </li>
              <li>
                **Emotional impact**: The loss of loved ones or homes can lead to trauma and stress.
              </li>
              <li>
                **Economic challenges**: Recovery can be financially draining for affected families.
              </li>
            </ul>
          </section>

          {/* What to Do After a Flood Section */}
          <section>
            <h2 className="text-xl font-semibold text-red-600">What to Do After a Flood</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                Avoid consuming <b>contaminated water</b>. Use boiled or purified water for drinking and cooking.
              </li>
              <li>
                Clean and disinfect your home. Use bleach to sanitize affected areas.
              </li>
              <li>
                Seek medical help if you experience symptoms like fever, diarrhea, or rashes.
              </li>
              <li>
                Report damaged infrastructure, such as broken bridges or power lines, to local authorities.
              </li>
              <li>
                Support neighbors and community members in rebuilding efforts.
              </li>
            </ul>
          </section>
        </main>

        <footer className="bg-gray-100 py-4 px-6 mt-8">
          <p className="text-center text-sm text-gray-500">
            Stay safe and resilient. Together, we can overcome the challenges of floods. For more information, contact{' '}
            <b>Bangladesh Red Crescent Society</b> or visit your local disaster management office.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default FloodPrecautionsPage;
