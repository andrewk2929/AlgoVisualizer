import drawPath from "../drawPath";

const Dijkstra = (grid, startNode, endNode, rows, cols) => {
  const distances = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const previous = Array.from({ length: rows }, () => Array(cols).fill(null));
  const pq = [];

  const startRow = startNode[0];
  const startCol = startNode[1];
  distances[startRow][startCol] = 0;
  pq.push({ row: startRow, col: startCol, dist: 0 });

  // neighbors (r d l up)
  const directions = [
    [0, 1], [1, 0], [0, -1], [-1, 0]
  ];

  const newGrid = grid.map(row => row.map(cell => ({ ...cell })));

  while (pq.length > 0) {
    pq.sort((a, b) => a.dist - b.dist);
    const current = pq.shift(); // shift renoves and returns first element
    const { row, col } = current;

    // check if node alr visited
    if (visited[row][col]) {
      continue;
    }
    visited[row][col] = true;

    const currentNode = newGrid[row][col];
    if (!currentNode.isStart && !currentNode.isEnd) {
      currentNode.isVisited = true;
    }

    if (row === endNode[0] && col === endNode[1]) {
      drawPath(previous, newGrid, endNode);  // now also pass endNode
      return { grid: newGrid, previous };
    }

    // all neighbor loop
    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;

      // check if in bounds
      if (
        newRow >= 0 && newRow < rows &&
        newCol >= 0 && newCol < cols &&
        !visited[newRow][newCol] &&
        !newGrid[newRow][newCol].isWall
      ) {

        const weight = newGrid[newRow][newCol].weight;
        const newDist = distances[row][col] + weight;
        
        if (newDist < distances[newRow][newCol]) {
          distances[newRow][newCol] = newDist;
          previous[newRow][newCol] = [row, col];
          pq.push({ row: newRow, col: newCol, dist: newDist });
        }
      }
    }
  }

  return { grid: newGrid, previous };
};

export default Dijkstra;
