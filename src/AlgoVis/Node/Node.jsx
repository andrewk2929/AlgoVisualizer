import React from 'react';
import './Node.css'; 

const Node = ({ node, onClick, className }) => {
    return (
      <div
        className={className}
        id={`node-${node.row}-${node.col}`}
        onClick={() => onClick(node)} 
      >
      {node.weight > 1 && <span className="weight-label">{node.weight}</span>}
      </div>
    );
  };
  

export default Node;
