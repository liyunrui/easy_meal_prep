import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ReactiveBase } from '@appbaseio/reactivesearch';

import Navbar from './components/Navbar'
import Login from './components/Login'
import Register from './components/Register'
import Profile from './components/Profile'
import Landing from './components/Landing' //landing page
import Search from './components/Search' 

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <div className="container">
          <Route exact path="/" component={Landing} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/search" component={Search} />
        </div>
      </Router>
    </div>
  );
}

export default App;
