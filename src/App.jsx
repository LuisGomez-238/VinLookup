import { useState } from 'react'
import PropTypes from 'prop-types'
import ApiWorker from './ApiWorker?worker'
import './App.css'

function App() {

  const [vin, setVin] = useState('')
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    setVin(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (vin) {
      const worker = new ApiWorker();
      const apiKey = import.meta.env.VITE_API_KEY;

      try {
        const result = await new Promise((resolve, reject) => {
          worker.onmessage = (event) => {
            const { type, data: workerData, error: workerError } = event.data;
            if (type === 'success') {
              resolve({ data: workerData });
            } else if (type === 'error') {
              reject(new Error(workerError));
            }
            worker.terminate();
          };
          worker.postMessage({ vin, apiKey: apiKey})
        });
        setData(result.data);
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const NoVin = () => <p>type in VIN above to see results</p>;

  const InfoCard = ({ title, value }) => (
    <div className="info-card">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );

  InfoCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  };
  
return (
  
  <div className="Main">
    <form className="Form"onSubmit={handleSubmit}>
      <input
        type="text"
        value={vin}
        placeholder="VIN"
        onChange={handleChange}
        className="vinInput">
      </input>
      <button type="submit" className="lookupButton">Lookup VIN</button>
    </form>
    {data ? (
      <>
        <h2>Vehicle Information</h2>
        <div className="info-container">
          <InfoCard title="Year" value={data.year} />
          <InfoCard title="Make" value={data.make} />
          <InfoCard title="Model" value={data.model} />
          <InfoCard title="Trim" value={data.trim} />
        </div>
      </>
    ) : (
      <NoVin />
    )}
    {error && <p style={{ color: 'red' }}>{error}</p>}


  </div>
);

}

export default App