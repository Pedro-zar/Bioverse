import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/db';

interface IntakeData {
  age: string;
  weight: string;
  height: string;
  symptoms: string;
  history: string;
  lifestyle: string;
}

interface IntakeResponse {
  recommendation?: string;
  riskScore?: number;
  error?: string;
}

// Simulated ML function that generates a recommendation and risk score
function simulateML(data: IntakeData): { recommendation: string; riskScore: number } {
  const ageNum = parseInt(data.age);
  const weightNum = parseFloat(data.weight);
  
  let risk = 'Low risk';
  let riskScore = 1;
  if (ageNum > 60 || weightNum > 80) {
    risk = 'High risk';
    riskScore = 3;
  }
  
  const recommendation = `${risk} – Recommend ${risk === 'High risk' ? 'immediate evaluation' : 'maintaining current habits'}.`;
  return { recommendation, riskScore };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IntakeResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { age, weight, height, symptoms, history, lifestyle } = req.body;

  // Validate that all fields are provided
  if (!age || !weight || !height || !symptoms || !history || !lifestyle) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Process ML simulation
  const { recommendation, riskScore } = simulateML({ age, weight, height, symptoms, history, lifestyle });

  try {
    // Insert data into the patient_intake table
    const newSubmission = await prisma.patient_intake.create({
      data: {
        username: "patient", // placeholder since the Login is being hardcoded
        submission_data: { age, weight, height, symptoms, history, lifestyle },
        recommendation,
        riskScore,
      },
    });

    console.log('New submission inserted:', newSubmission);

    // Return the recommendation and risk score
    return res.status(200).json({ recommendation, riskScore });
  } catch (error) {
    console.error('Error inserting data:', error);
    return res.status(500).json({ error: 'Unexpected error occurred.' });
  }
}
