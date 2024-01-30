// import { useState, useEffect } from 'react'
import { useState } from 'react'
import PropTypes from 'prop-types'
import ApiWorker from './ApiWorker?worker'
import './App.css'

function App() {

  const [vin, setVin] = useState('')
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   if (vin) {
  //     // creates a new worker
  //     // const worker = new Worker('worker-loader!./ApiWorker.js');
  //     const worker = new ApiWorker();

  //     worker.onmessage = (event) => {
  //       const { type, data: workerData, error: workerError } = event.data;

  //       if (type === 'success') {
  //         setData(workerData);
  //       } else if (type === 'error') {
  //         setError(workerError);
  //       }
  // };

  //     // Post a message to the worker to start fetching data
  //     worker.postMessage({ vin, apiKey: '9ec4c15cdemshb05293c223ed1a5p1606d9jsn3a2e64e4493a' });

  //     // Cleanup: terminate the worker when it's no longer needed
  //     return () => worker.terminate();
  //   }
  // }, [vin]);

  const handleChange = (event) => {
    setVin(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (vin) {
      const worker = new ApiWorker();
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
          worker.postMessage({ vin, apiKey: '9ec4c15cdemshb05293c223ed1a5p1606d9jsn3a2e64e4493a'})
        });
        setData(result.data);
      } catch (error) {
        setError(error.message);
      }
    }
  };
  //     worker.onmessage = (event) => {
  //       const { type, data: workerData, error: workerError } = event.data;
  //       if (type === 'success') {
  //         setData(workerData);
  //       } else if (type === 'error') {
  //         setError(workerError);
  //       }
  //       // Cleanup: terminate the worker when it's no longer needed
  //       worker.terminate();
  //     };
  //     // Post a message to the worker to start fetching data
  //     worker.postMessage({ vin, apiKey: '9ec4c15cdemshb05293c223ed1a5p1606d9jsn3a2e64e4493a' });
  //   }
  // };
  console.log(data);

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
//http://localhost:5173/?