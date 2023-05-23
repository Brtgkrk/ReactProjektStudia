import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import {BrowserRouter as Router} from 'react-router-dom';


ReactDOM.render(
  <Router>
  <BrowserRouter basename="/ReactProjektStudia">
    <App />
  </BrowserRouter>
  </Router>,
  document.getElementById("root")
);