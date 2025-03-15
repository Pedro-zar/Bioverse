import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/db';

interface SubmissionResponse {
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
  createdAt?: Date;
}

type IntakeFields = {
  age: string;
  weight: string;
  height: string;
  symptoms: string;
  history: string;
  lifestyle: string;
};



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SubmissionResponse | SubmissionResponse[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (id) {
    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid id parameter' });
    }

    const submission = await prisma.patient_intake.findUnique({
      where: { id: parseInt(id) },
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    const intakeData: IntakeFields =
      typeof submission.submission_data === 'object' && submission.submission_data !== null
        ? (submission.submission_data as IntakeFields)
        : {
            age: '',
            weight: '',
            height: '',
            symptoms: '',
            history: '',
            lifestyle: '',
          };
    // Return all data for specific IDs
    return res.status(200).json({
      id: submission.id.toString(),
      username: submission.username,
      timestamp: submission.createdAt.toISOString(),
      recommendation: submission.recommendation || '',
      riskScore: submission.riskScore || 0,
      age: intakeData.age,
      weight: intakeData.weight,
      height: intakeData.height,
      symptoms: intakeData.symptoms,
      history: intakeData.history,
      lifestyle: intakeData.lifestyle,
    });
  } else {
    // Return less-detailed data all IDs
    const submissions = await prisma.patient_intake.findMany();
    const limitedSubmissions = submissions.map((submission: SubmissionResponse) => ({
      id: submission.id.toString(),
      username: submission.username,
      timestamp: submission.createdAt?.toISOString(),
      recommendation: submission.recommendation,
      riskScore: submission.riskScore,
    }));
    return res.status(200).json(limitedSubmissions);
  }
}
