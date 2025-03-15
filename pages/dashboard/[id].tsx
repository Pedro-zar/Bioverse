import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Header from '../../components/header';
import styles from '../../styles/dashboard.module.css';

interface Submission {
  id: string;
  username: string;
  timestamp: string;
  recommendation: string;
  riskScore: number;
  age: string;
  weight: string;
  height: string;
  symptoms: string;
  history: string;
  lifestyle: string;
}

export default function SubmissionDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id || !router.isReady) return;

    async function fetchSubmission() {
      try {
        const res = await fetch(`/api/submissions?id=${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch submission details');
        }
        const data = await res.json();
        setSubmission(data);
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubmission();
  }, [id, router.isReady]);

  if (loading) return <p>Loading submission details...</p>;
  if (!submission) return <p>No submission found.</p>;

  return (
    <div className={styles.dashboardContainer}>
      <Header>Submission Details</Header>
      <div className={styles.detailsContainer}>
        <p>
          <strong>Patient:</strong> {submission.username}
        </p>
        <p>
          <strong>Timestamp:</strong>{' '}
          {new Date(submission.timestamp).toLocaleString()}
        </p>
        <p>
          <strong>Recommendation:</strong> {submission.recommendation}
        </p>
        <p>
          <strong>Risk Score:</strong> {submission.riskScore}
        </p>
        <p>
          <strong>Age:</strong> {submission.age}
        </p>
        <p>
          <strong>Weight:</strong> {submission.weight}
        </p>
        <p>
          <strong>Height:</strong> {submission.height}
        </p>
        <p>
          <strong>Symptoms:</strong> {submission.symptoms}
        </p>
        <p>
          <strong>Medical History:</strong> {submission.history}
        </p>
        <p>
          <strong>Activity Level:</strong> {submission.lifestyle}
        </p>
      </div>
    </div>
  );
}
