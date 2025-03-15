import React, { useState } from 'react';
import Header from '../../components/header'

interface FormData {
  age: string;
  weight: string;
  height: string,
  symptoms: string;
  history: string;
  lifestyle: string;
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
  interface IntakeResult {
    riskScore: number;
    recommendation: string;
  }
  const [result, setResult] = useState<IntakeResult | null>(null);
  // Measurement System: 1 = metric, 2 = imperial
  const [choice, setChoice] = useState<string>('1');
  // Needed to convert from imperial to metric
  const [feet, setFeet] = useState<Array<string>>(['0','0'])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const validateForm = () => {
    // All fields are required to be filled properly
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
        headers: {
          'Content-Type': 'application/json',
        },
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

  // Normalize the value stored in the formData to the Metric system with the convertions
  const convertWeight = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldValue = String(Number(e.target.value)/2.205)
      setFormData((prev) => ({
      ...prev,
      weight: fieldValue,
    }));
  }

  const convertHeight = async () => {
    // 30.48 and 2.54 are the values to convert from feet and inches to centimeters
    const fieldValue = String(Number(feet[0])*30.48+Number(feet[1])*2.54)
      setFormData((prev) => ({
      ...prev,
      height: fieldValue,
    }));
  }

  return (
    <div>
      <Header>Intake Formulary</Header>
      {result ? (
        <div style={{ textAlign: 'center' }}>
          <h2>Here are our thoughts</h2>
          <table style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td
                  style={{
                    padding: '8px',
                    textAlign: 'left',
                  }}
                  colSpan={2}
                >
                  <strong>Risk Score:</strong> {result.riskScore}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: '8px',
                    fontWeight: 'bold',
                    textAlign: 'left',
                  }}
                  colSpan={2}
                >
                  Recommendations
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: '8px',
                    textAlign: 'left',
                  }}
                  colSpan={2}
                >
                  {result.recommendation}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div>
            <label>Age</label>
            <input
              type="number"
              name="age"
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Measurement System</label>
            <select
              name="weight"
              onChange={(e)=>{
                setFormData((prev) => ({ ...prev, height: '' }));
                setChoice(e.target.value)
              }}
            >
              <option value="1">Metric</option>
              <option value="2">Imperial</option>
            </select>
          </div>
          <div>
            <label>Weight ({choice === '1' ? "kg" : "lbs"})</label>
            <input
              type="number"
              name="weight"
              onChange={choice === '1'? handleChange : convertWeight}
            />
          </div>
          <div>
            <label>Height {choice === '1' ? "(cm)" : ""}</label>
            { choice === '1' ? 
            (<input
              type="number"
              name="height"
              onChange={handleChange}
            />)
            : 
            (<>
              <input
                type="number"
                name="feet"
                onChange={(e)=>{
                  setFeet((prev) => {
                    const newFeet = [...prev];
                    newFeet[1] = e.target.value;
                    return newFeet;
                  });
                  convertHeight()
                }}
              />
              <input
                type="number"
                name="inches"
                onChange={(e)=>{
                  setFeet((prev) => {
                    const newInch = [...prev];
                    newInch[0] = e.target.value;
                    return newInch;
                  });
                  convertHeight()
                }}
              />
            </>)
            }
          </div>
          <div>
            <label>Symptoms</label>
            <textarea
              name="symptoms"
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Medical history</label>
            <textarea
              name="history"
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Activity level</label>
            <select
              name="lifestyle"
              onChange={handleChange}
            >
              <option value="1">Sedentary (office job)</option>
              <option value="2">Light Exercise (1-2 days/week)</option>
              <option value="3">Moderate Exercise (3-5 days/week)</option>
              <option value="4">Heavy Exercise (6-7 days/week)</option>
              <option value="5">Athlete (2x per day)</option>
            </select>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      )}
    </div>
  );
};

export default Intake;
