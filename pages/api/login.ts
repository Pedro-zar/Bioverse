import type { NextApiRequest, NextApiResponse } from 'next';

interface LoginResponse {
  role?: 'patient' | 'doctor';
  error?: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse<LoginResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing credentials' });
  }

  // Hardcoded logic
  if (username === 'doctor' && password === 'doctor') {
    return res.status(200).json({ role: 'doctor' });
  } else if (username === 'patient' && password === 'patient') {
    return res.status(200).json({ role: 'patient' });
  } else {
    return res.status(401).json({ error: 'There was a problem with your username or password.' });
  }
}
