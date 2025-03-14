import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Submission {
  id: string;
  username: string;
  timestamp: string;
  recommendation: string;
}

const Dashboard: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await fetch('/api/submissions');
        if (!res.ok) {
          throw new Error('Erro ao carregar as submissões');
        }
        const data = await res.json();
        setSubmissions(data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div>
      <h1>Clinical Dashboard</h1>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <table border={1} cellPadding={8} cellSpacing={0}>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Timestamp</th>
              <th>Recommendation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr key={sub.id}>
                <td>{sub.username}</td>
                <td>{new Date(sub.timestamp).toLocaleString()}</td>
                <td>{sub.recommendation}</td>
                <td>
                  <Link href={`/dashboard/${sub.id}`}>
                    More details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;
