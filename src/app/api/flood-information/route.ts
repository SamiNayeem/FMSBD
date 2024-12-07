// File: app/api/flood-info/route.ts

import { NextResponse } from "next/server";

export async function GET() {
  const floodData = {
    precautions: [
      "Stay informed through reliable sources such as Bangladesh Meteorological Department.",
      "Keep an emergency kit ready with essentials like food, water, flashlight, batteries, and first-aid supplies.",
      "Move to higher ground if you live in flood-prone areas.",
      "Store important documents in waterproof bags or containers.",
      "Turn off gas, electricity, and water supplies before evacuating.",
      "Avoid walking or driving through floodwaters, as just six inches of water can knock you down.",
    ],
    aftereffects: [
      "Health risks: Contaminated water can lead to diseases like cholera, dengue, and skin infections.",
      "Loss of property: Floodwaters may damage homes, crops, and infrastructure.",
      "Emotional impact: The loss of loved ones or homes can lead to trauma and stress.",
      "Economic challenges: Recovery can be financially draining for affected families.",
    ],
    actionsAfterFlood: [
      "Avoid consuming contaminated water. Use boiled or purified water for drinking and cooking.",
      "Clean and disinfect your home. Use bleach to sanitize affected areas.",
      "Seek medical help if you experience symptoms like fever, diarrhea, or rashes.",
      "Report damaged infrastructure, such as broken bridges or power lines, to local authorities.",
      "Support neighbors and community members in rebuilding efforts.",
    ],
  };

  return NextResponse.json(floodData, { status: 200 });
}
