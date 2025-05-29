import React, { useState, Component } from 'react';
import Node from './Node/Node'; 
import './AlgoVis.css';    
import Dijkstra from "./Algorithms/Dijkstra";
import drawPath from './drawPath';
import { AStar } from './Algorithms/AStar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';

// let user choose rows and colls

const rows = 20;
const cols = 20;

const createEmptyGrid = () => {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      row,
      col,
      isStart: false,
      isEnd: false,
      isWall: false,
      isVisited: false,
      isPath: false,
      weight: 1
    }))
  );
};

const AlgoVis = () => {
  const [grid, setGrid] = useState(createEmptyGrid);
  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);
  const [step, setStep] = useState(0); // 0 = start 1 = end 2 = walls 3 = weights

  const handleNodeClick = (node) => {
    // clone grids and node
    const newGrid = grid.slice();
    const newNode = { ...node };

    // start, end, then wall
    if (step === 0) {
      newNode.isStart = true;
      setStartNode([node.row, node.col]);
      setStep(1);
    } else if (step === 1) {
      newNode.isEnd = true;
      setEndNode([node.row, node.col]);
      setStep(2);
    } else if (step === 2) {
      newNode.isWall = !newNode.isWall;
    } else {
      // 10 is max
      if (newNode.weight > 9) {
        alert("Weight is too high!")
      } else {
        newNode.weight++;
      }
    }

    newGrid[node.row][node.col] = newNode;
    setGrid(newGrid);
  };

  const runDijkstra = () => {
    if (!startNode || !endNode) {
      alert('Please select a start and end node');
      return;
    }
    const { grid: newGrid } = Dijkstra(grid, startNode, endNode, rows, cols);
    setGrid(newGrid);
  };

  const runAStar= () => {
    if (!startNode || !endNode) {
      alert('Please select a start and end node');
      return;
    }
    const { grid: newGrid } = AStar(grid, startNode, endNode, rows, cols);
    setGrid(newGrid);
  }

  const clearBoard = () => {
    const newGrid = createEmptyGrid();
    setGrid(newGrid);
    setStartNode(null);
    setEndNode(null);
    setStep(0);
  };
  
  const randNodes = () => {
    if (startNode || endNode) {
        // return;
        clearBoard();
    }
  
    const newGrid = createEmptyGrid();

    // 2 vars prob better than 1 if grid isnt square
    const randomRow = () => Math.floor(Math.random() * rows);
    const randomCol = () => Math.floor(Math.random() * cols);

    let sRow = randomRow(), sCol = randomCol();
    let eRow = randomRow(), eCol = randomCol();
  
    // so start and end not same
    while (sRow === eRow && sCol === eCol) {
      eRow = randomRow(); eCol = randomCol();
    }
  
    newGrid[sRow][sCol].isStart = true;
    newGrid[eRow][eCol].isEnd = true;
  
    setGrid(newGrid);
    setStartNode([sRow, sCol]);
    setEndNode([eRow, eCol]);
    setStep(2);
  };
  

  return (
    <div className="container text-center">
      <h1>Algo Visualizer</h1>
         <div className="d-flex justify-content-center gap-2 my-3">
            <p>Start Node: </p>
         <div class = "startSqr"></div>
         <p>End Node: </p>
         <div class = "endSqr"></div>
         <p>Wall: </p>
         <div class = "wallSqr"></div>
            <Button className = "btn btn-danger" variant="danger" onClick = {randNodes}>Random!</Button>
            <Button className = "btn btn-primary" variant="primary" onClick={clearBoard}>Clear Board</Button>
            <Button className ="btn btn-success" variant = "success" onClick={runDijkstra}>Start Dijkstra</Button>
            <Button className ="btn btn-success" variant = "success" onClick={runAStar}>Start A*</Button>
            {step === 2 &&
              <Button className ="btn btn-success" variant = "success" onClick={() => setStep(3)}>Weighted Mode OFF</Button>
            }
            {step === 3 &&
              <Button className ="btn btn-success" variant = "success" onClick={() => setStep(2)}>Weighted Mode ON</Button>
            }
         </div>
      {grid.map((row, rowIndex) => (
  <div key={rowIndex} className="grid-row">
    {row.map((node, colIndex) => {
      let className = 'node';
      if (node.isStart) className += ' start';
      else if (node.isEnd) className += ' end';
      else if (node.isWall) className += ' wall';
      else if (node.isPath) className += ' path';
      else if (node.isVisited) className += ' visited';

      return (
        <Node 
          key={`${rowIndex}-${colIndex}`} 
          node={node} 
          onClick={handleNodeClick} 
          className={className}
        />
      );
    })}
  </div>
))}

    </div>
  );
};

export default AlgoVis;
