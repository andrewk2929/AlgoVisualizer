import drawPath from "../drawPath";

// Manhattan distance heuristic
const heuristic = (a, b) => {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
};

export const AStar = (grid, startNode, endNode, rows, cols) => {
  const openSet = []; // nodes to explore
  const gScore = Array.from({ length: rows }, () => Array(cols).fill(Infinity)); // actual dist from start node
  const fScore = Array.from({ length: rows }, () => Array(cols).fill(Infinity)); // dist with weights (g-heuristic guess)
  const cameFrom = Array.from({ length: rows }, () => Array(cols).fill(null));
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

  const [startRow, startCol] = startNode;
  const [endRow, endCol] = endNode;

  const newGrid = grid.map(row => row.map(cell => ({ ...cell })));

  gScore[startRow][startCol] = 0;
  fScore[startRow][startCol] = heuristic(startNode, endNode);
  openSet.push({ row: startRow, col: startCol, f: fScore[startRow][startCol] });

  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // right, down, left, up

  while (openSet.length > 0) {
    // Choose node with lowest fScore
    openSet.sort((a, b) => a.f - b.f);
    const { row, col } = openSet.shift();

    if (visited[row][col]) continue;
    visited[row][col] = true;

    const node = newGrid[row][col];
    if (!node.isStart && !node.isEnd) node.isVisited = true;

    if (row === endRow && col === endCol) {
      drawPath(cameFrom, newGrid, endNode);
      return { grid: newGrid, cameFrom };
    }

    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;

      if (
        newRow >= 0 && newRow < rows &&
        newCol >= 0 && newCol < cols &&
        !visited[newRow][newCol] &&
        !newGrid[newRow][newCol].isWall
      ) {
        const neighbor = newGrid[newRow][newCol];
        const weight = neighbor.weight ?? 1;
        const tentativeG = gScore[row][col] + weight; // factoring in weight now  

        if (tentativeG < gScore[newRow][newCol]) {
          gScore[newRow][newCol] = tentativeG;
          fScore[newRow][newCol] = tentativeG + heuristic([newRow, newCol], endNode);
          cameFrom[newRow][newCol] = [row, col];
          openSet.push({ row: newRow, col: newCol, f: fScore[newRow][newCol] });
        }
      }
    }
  }

  return { grid: newGrid, cameFrom }; // in case no path found
};
