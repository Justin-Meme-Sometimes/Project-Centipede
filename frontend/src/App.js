import logo from './logo.svg';
import './App.css';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import MapComponent from './components/MapComponent';
import 'leaflet/dist/leaflet.css';

function App() {

  /*const [apiMessage, setApiMessage] = useState('');


  useEffect(() => {axios.get('api/test')
    .then(res => setApiMessage(res.data.message))
    .catch(rest => setApiMessage('Connection Failed')); }, []); 
  return (

    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p> {apiMessage} </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );*/

  return(
    <div className="App">
      <h1>My Location Map</h1>
      <MapComponent />
    </div>
  );
}

export default App;
