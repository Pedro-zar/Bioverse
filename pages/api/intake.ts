import type { NextApiRequest, NextApiResponse } from 'next';

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
  
  // Simple logic: if age is greater than 60 or weight is greater than 80 then high risk
  let risk = 'Low risk';
  let riskScore = 1;
  if (ageNum > 60 || weightNum > 80) {
    risk = 'High risk';
    riskScore = 3;
  }
  
  const recommendation = `${risk} – Recommend ${risk === 'High risk' ? 'immediate evaluation' : 'maintaining current habits'}.`;
  return { recommendation, riskScore };
}

export default function handler(req: NextApiRequest, res: NextApiResponse<IntakeResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { age, weight, height, symptoms, history, lifestyle } = req.body;

  // Validate that all fields are provided
  if (!age || !weight || !height || !symptoms || !history || !lifestyle) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Simulate ML processing
  const { recommendation, riskScore } = simulateML({ age, weight, height, symptoms, history, lifestyle });
  
  // Simulated persistence logging
  console.log('New submission:', {
    age,
    weight,
    height,
    symptoms,
    history,
    lifestyle,
    recommendation,
    riskScore,
    timestamp: new Date().toISOString(),
  });

  // Return both recommendation and riskScore
  return res.status(200).json({ recommendation, riskScore });
}
