const drawPath = (previous, newGrid, endNode) => {
    let [row, col] = endNode;
    const path = [];
    // if prev exists loop through all
    while (previous[row][col]) {
      path.push([row, col]);
      [row, col] = previous[row][col];
    }
    path.reverse();
    for (const [r, c] of path) {
      if (!newGrid[r][c].isStart && !newGrid[r][c].isEnd) {
        newGrid[r][c].isPath = true; // make it blue in css
      }
    }
  };
  
  export default drawPath;
  