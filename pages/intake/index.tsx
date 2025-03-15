import React, { useState } from 'react';
import Header from '../../components/header';
import styles from '../../styles/intake.module.css';

interface FormData {
  age: string;
  weight: string;
  height: string;
  symptoms: string;
  history: string;
  lifestyle: string;
}

interface IntakeResult {
  riskScore: number;
  recommendation: string;
}

const Intake: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    age: '',
    weight: '',
    height: '',
    symptoms: '',
    history: '',
    lifestyle: '1',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IntakeResult | null>(null);

  // Measurement System: 1 = metric, 2 = imperial
  const [choice, setChoice] = useState<string>('1');
  // Needed to convert from imperial to metric
  const [feet, setFeet] = useState<Array<string>>(['0', '0']);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    // All fields must be filled
    for (const key in formData) {
      if (formData[key as keyof FormData].trim() === '') {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      setError('All fields must be filled.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Error in data submission.');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Unexpected error.');
      } else {
        setError('Unexpected error.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Convert Imperial weight to Metric
  const convertWeight = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldValue = String(Number(e.target.value) / 2.205);
    setFormData((prev) => ({
      ...prev,
      weight: fieldValue,
    }));
  };

  // Convert Imperial height (feet + inches) to cm
  const convertHeight = async () => {
    // 30.48 and 2.54 are conversion factors for feet and inches to centimeters
    const fieldValue = String(Number(feet[0]) * 30.48 + Number(feet[1]) * 2.54);
    setFormData((prev) => ({
      ...prev,
      height: fieldValue,
    }));
  };

  return (
    <div className={styles.intakeContainer}>
      <div className={styles.formContainer}>
        <Header>Intake Formulary</Header>

        {result ? (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <h2>Here are our thoughts</h2>
            <table style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '8px', textAlign: 'left' }} colSpan={2}>
                    <strong>Risk Score:</strong> {result.riskScore}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', fontWeight: 'bold', textAlign: 'left' }} colSpan={2}>
                    Recommendations
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', textAlign: 'left' }} colSpan={2}>
                    {result.recommendation}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.intakeForm}>
            {error && <p className={styles.errorText}>{error}</p>}

            <div className={styles.fieldGroup}>
              <label className={styles.labelText}>Age</label>
              <input
                className={styles.fieldBox}
                type="number"
                name="age"
                onChange={handleChange}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.labelText}>Measurement System</label>
              <select
                className={styles.fieldBox}
                name="weight"
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, height: '' }));
                  setChoice(e.target.value);
                }}
              >
                <option value="1">Metric</option>
                <option value="2">Imperial</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.labelText}>
                Weight ({choice === '1' ? 'kg' : 'lbs'})
              </label>
              <input
                className={styles.fieldBox}
                type="number"
                name="weight"
                onChange={choice === '1' ? handleChange : convertWeight}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.labelText}>
                Height {choice === '1' ? '(cm)' : ''}
              </label>
              {choice === '1' ? (
                <input
                  className={styles.fieldBox}
                  type="number"
                  name="height"
                  onChange={handleChange}
                />
              ) : (
                <>
                  <input
                    className={styles.fieldBox}
                    type="number"
                    name="feet"
                    placeholder="Feet"
                    onChange={(e) => {
                      setFeet((prev) => {
                        const newFeet = [...prev];
                        newFeet[1] = e.target.value;
                        return newFeet;
                      });
                      convertHeight();
                    }}
                  />
                  <input
                    className={styles.fieldBox}
                    type="number"
                    name="inches"
                    placeholder="Inches"
                    onChange={(e) => {
                      setFeet((prev) => {
                        const newInch = [...prev];
                        newInch[0] = e.target.value;
                        return newInch;
                      });
                      convertHeight();
                    }}
                  />
                </>
              )}
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.labelText}>Symptoms</label>
              <textarea
                className={styles.fieldBox}
                name="symptoms"
                onChange={handleChange}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.labelText}>Medical history</label>
              <textarea
                className={styles.fieldBox}
                name="history"
                onChange={handleChange}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.labelText}>Activity level</label>
              <select
                className={styles.fieldBox}
                name="lifestyle"
                onChange={handleChange}
                value={formData.lifestyle}
              >
                <option value="1">Sedentary (office job)</option>
                <option value="2">Light Exercise (1-2 days/week)</option>
                <option value="3">Moderate Exercise (3-5 days/week)</option>
                <option value="4">Heavy Exercise (6-7 days/week)</option>
                <option value="5">Athlete (2x per day)</option>
              </select>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Intake;
