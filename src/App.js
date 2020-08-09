import Amplify from 'aws-amplify';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './App.css';

import awsmobile from './aws-exports';
import EventsList from './components/EventsList/EventsList';

Amplify.configure(awsmobile);

function App() {
  return (
    <Router>
      <div className="App">
        <main className="container mx-auto px-5">
          <Route path="/" exact component={EventsList} />
          <Route path="/:currentDay" component={EventsList} />
        </main>
      </div>
    </Router>
  );
}

export default App;
