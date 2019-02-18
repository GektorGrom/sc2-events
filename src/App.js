import Amplify from 'aws-amplify';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './App.css';

import awsmobile from './aws-exports';
import EventsList from './components/EventsList/EventsList';
import './styles/tailwind.css';

Amplify.configure(awsmobile);

function App() {
  return (
    <Router>
      <div className="App bg-blue-darkest">
        <header className="App-header">
          <img
            src="/images/logo/game-logo-sc2.png"
            className="App-logo"
            alt="logo"
          />
          <div className="container mx-auto px-5">
            <Route path="/" exact component={EventsList} />
            <Route path="/:currentDay" component={EventsList} />
          </div>
        </header>
      </div>
    </Router>
  );
}

export default App;
