import type { NextApiRequest, NextApiResponse } from 'next';

interface Submission {
  id: string;
  username: string;
  timestamp: string;
  recommendation: string;
  riskScore: number;
  age?: string;
  weight?: string;
  height?: string;
  symptoms?: string;
  history?: string;
  lifestyle?: string;
}

// Simulated data (in a real app, data would come from a database)
const submissions: Submission[] = [
  {
    id: '1',
    username: 'patient1',
    timestamp: new Date().toISOString(),
    recommendation: 'Low risk – Maintain current habits',
    riskScore: 1,
    age: '25',
    weight: '70',
    height: '170',
    symptoms: 'None',
    history: 'N/A',
    lifestyle: 'Sedentary',
  },
  {
    id: '2',
    username: 'patient2',
    timestamp: new Date().toISOString(),
    recommendation: 'High risk – Further evaluation recommended',
    riskScore: 3,
    age: '30',
    weight: '90',
    height: '180',
    symptoms: 'Cough, fever',
    history: 'Asthma',
    lifestyle: 'Active',
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  /* Two types of requests:
   * 1 - Without an ID, return all submissions with non-detailed data.
   * 2 - With a specific ID, return the full submission data (including form responses).
   */
  const { id } = req.query;
  if (id) {
    if (typeof id !== 'string') {
      res.status(400).json({ error: 'Invalid id parameter' });
      return;
    }

    const submission = submissions.find((sub) => sub.id === id);
    if (!submission) {
      res.status(404).json({ error: 'Submission not found' });
      return;
    }

    // Return full data with form responses for a specific ID
    res.status(200).json(submission);
  } else {
    // No id provided, return all submissions with limited data
    const limitedSubmissions = submissions.map(({ id, username, timestamp, recommendation, riskScore }) => ({
      id,
      username,
      timestamp,
      recommendation,
      riskScore,
    }));
    res.status(200).json(limitedSubmissions);
  }
}
