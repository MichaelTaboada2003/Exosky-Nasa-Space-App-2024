import React, { useState } from 'react';
import LoadingScreen from './LoadingScreen';

const App = () => {
  const [loading, setLoading] = useState(true);

  const generateStars = () => {
    const starsArray = [];
    for (let i = 0; i < 100; i++) {
      const style = {
        top: `${Math.random() * 100}vh`,
        left: `${Math.random() * 100}vw`,
      };
      starsArray.push(<div className="star" style={style} key={i}></div>);
    }
    return starsArray;
  };

  return (
    <div className='body'>
      {generateStars()} {}
      {loading ? (
        <LoadingScreen setLoading={setLoading} />
      ) : (
        <div className='divInfo'>
          <div className='titleContainer'>
            <h1 className='titulazo'>EXOSKY!</h1>
          </div> {/*Div del titulazo*/}
          <div className='infoContainer'>
            <div>
            <h3>What is an exoplanet?</h3>
              <p className='textoInfo'>
            All the planets in our solar system revolve around the Sun. Planets that revolve around stars other than our Sun are known as exoplanets. These exoplanets are difficult to observe directly through telescopes because the brightness of their stars obscures them.
            Therefore, astronomers use alternative methods to detect and examine these distant planets. They observe the impact that exoplanets have on the stars they orbit to identify them.
              </p>
            </div>{/*Div del contenedor del primer parrafo*/}
            <div>
              <h3>What is EXOSKY?</h3>
              <p className='textInfo'>EXOSKY is an educational app designed to give students a unique view of the night sky from the perspective of distant exoplanets. Using data from NASA's Exoplanet Archive, which includes over 5500 discovered exoplanets, the app combines these locations with the latest star catalogs to generate interactive star maps. Students can choose an exoplanet and explore what the sky would look like from that vantage point. The app also allows users to export high-quality images of the star charts, enabling them to visualize, draw, and name their own constellations, sparking creativity and curiosity about the universe.</p>
            </div>{/*div del contenedor del segundo parrafo*/}
          </div>{/*infor container*/}
          <div>

          
            
          </div> {/*Div del scrolleador del planetas*/}
        </div> //div info

      )}
    </div> //div body
  );
};

export default App;
