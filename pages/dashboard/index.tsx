import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../../components/header';
import styles from '../../styles/dashboard.module.css';

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
          throw new Error('Error loading submissions');
        }
        const data = await res.json();
        setSubmissions(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <Header>Clinical Dashboard</Header>
      {loading ? (
        <p className={styles.loadingText}>Loading data...</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
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
                      <a className={styles.detailsLink}>More details</a>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
