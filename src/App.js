import Amplify from 'aws-amplify';
import React from 'react';

import './App.css';

import awsmobile from './aws-exports';
import EventsList from './components/EventsList/EventsList';
import './styles/tailwind.css';

Amplify.configure(awsmobile);

function App() {
  return (
    <div className="App bg-blue-darkest">
      <header className="App-header">
        <img src="/images/logo/game-logo-sc2.png" className="App-logo" alt="logo" />
        <p className="mb-5">
          GraphQL data
        </p>
        <div className="container mx-auto px-5">
          <EventsList />
        </div>
      </header>
    </div>
  );
}

export default App;
