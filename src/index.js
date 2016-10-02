import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import Board from './board.js'

console.log(new Board(3).cells)

ReactDOM.render(
  <App board={new Board(5)}/>,
  document.getElementById('main')
);

