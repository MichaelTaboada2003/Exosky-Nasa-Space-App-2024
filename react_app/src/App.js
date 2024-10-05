// App.js
import React, { useState } from 'react';
import LoadingScreen from './LoadingScreen';

const App = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className='body'>
      {loading ? (
        <LoadingScreen setLoading={setLoading} />
      ) : (
        <div className='divInfo'>
          <h1 className='titulazo'>EXOSKY!</h1>
          <div className='infoContainer'>
          <h3>What is an exoplanet?</h3>
          <br></br>
          <p>All the planets in our solar system revolve around the Sun. Planets that revolve around stars other than our Sun are known as exoplanets. These exoplanets are difficult to observe directly through telescopes because the brightness of their stars obscures them.

Therefore, astronomers use alternative methods to detect and examine these distant planets. They observe the impact that exoplanets have on the stars they orbit to identify them.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
