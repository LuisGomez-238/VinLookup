

self.onmessage = async (event) => {
    const { vin, apiKey } = event.data;
    const URL = `https://car-api2.p.rapidapi.com/api/vin/${vin}`;
  
    try {
      const result = await fetch(URL, {
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'car-api2.p.rapidapi.com',
        },
      });
      const json = await result.json();
  
      // Send the data back to the main thread
      self.postMessage({ type: 'success', data: json });
    } catch (error) {
      // Send the error back to the main thread
      self.postMessage({ type: 'error', error: error.message });
    }
  };