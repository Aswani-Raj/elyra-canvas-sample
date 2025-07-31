import React from 'react'
import './index.scss'
import App from './App.jsx'
import { render } from "react-dom";
const root = document.getElementById("root");

render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  root
);