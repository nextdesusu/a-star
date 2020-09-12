export interface AStarNode {
  ancestor: AStarNode | null;
  visited: boolean;
  closed: boolean;
  solid: boolean;
  gWeight: number;
  lWeight: number;
  h: number;
  x: number;
  y: number;
}

export class NodeTable {
  pathSet: Set<AStarNode>;
  private _size: number;
  private nodes: Array<AStarNode>;
  private _start: AStarNode;
  private _end: AStarNode;
  constructor(tableSize: number) {
    this.pathSet = new Set();
    this._size = tableSize;
    this.nodes = new Array(tableSize * tableSize);
    for (let x = 0; x < tableSize; x += 1) {
      for (let y = 0; y < tableSize; y += 1) {
        const node: AStarNode = {
          ancestor: null,
          solid: false,
          visited: false,
          closed: false,
          gWeight: Infinity,
          lWeight: Infinity,
          h: -1,
          x,
          y
        };
        this.nodes[y * tableSize + x] = node;
      }
    }

    this._start = this.nodeAt(0, 0);
    this._end = this.nodeAt(tableSize - 1, tableSize - 1);
  }

  get size() {
    return this._size;
  }

  get end() {
    return this._end;
  }

  get start() {
    return this._start;
  }

  private reconstructPath() {
    let current = this.end;
    while (current.ancestor !== null) {
      current = current.ancestor;
      this.pathSet.add(current);
    }
  }

  belongsToPath(x: number, y: number): boolean {
    return this.pathSet.has(this.nodeAt(x, y));
  }

  setStartNode(x: number, y: number): boolean {
    const node = this.nodeAt(x, y);
    if (node !== this.end) {
      node.solid = false;
      this._start = node;
      return true;
    }
    return false;
  }

  setEndNode(x: number, y: number): boolean {
    const node = this.nodeAt(x, y);
    if (node !== this.start) {
      node.solid = false;
      this._end = node;
      return true;
    }
    return false;
  }

  nodeAt(x, y): AStarNode {
    return this.nodes[y * this.size + x];
  }

  *[Symbol.iterator]() {
    for (const node of this.nodes) {
      yield node;
    }
  }

  *neighboursOf(node: AStarNode) {
    const { x, y } = node;
    if (x > 0) {
      yield this.nodeAt(x - 1, y);
    }
    if (y > 0) {
      yield this.nodeAt(x, y - 1);
    }
    if (x < this.size - 1) {
      yield this.nodeAt(x + 1, y);
    }
    if (y < this.size - 1) {
      yield this.nodeAt(x, y + 1);
    }
  }

  findPath() {
    const { end, start } = this;
    const manhattanHeuristic = (n1: AStarNode, n2: AStarNode) => {
      const d1 = Math.abs(n2.x - n1.x);
      const d2 = Math.abs(n2.y - n1.y);
      return d1 + d2;
    }

    //change costs to min heap!
    start.gWeight = 0;
    start.lWeight = 0;
    start.h = manhattanHeuristic(start, end);
    start.visited = true;
    const costs: Array<AStarNode> = [start];
    while (costs.length > 0) {
      console.log("current...", costs);
      const current: AStarNode = costs.pop();
      if (current === end) {
        this.reconstructPath();
        return;
      }
      current.closed = true;
      for (const neighbour of this.neighboursOf(current)) {
        if (neighbour.solid || neighbour.closed) {
          continue;
        }
        //default cost is 1
        const gWeight = current.gWeight + 1;
        if (!neighbour.visited || gWeight < neighbour.gWeight) {
          neighbour.ancestor = current;
          neighbour.h = neighbour.h > - 1 ? neighbour.h : manhattanHeuristic(neighbour, end);
          neighbour.gWeight = gWeight;

          neighbour.lWeight = neighbour.gWeight + neighbour.h;
          if (!neighbour.visited) {
            neighbour.visited = true;
            costs.push(neighbour);
            costs.sort((n1: AStarNode, n2: AStarNode) => n2.lWeight - n1.lWeight);
          } else {
            costs.sort((n1: AStarNode, n2: AStarNode) => n2.lWeight - n1.lWeight);
          }
        }
      }
    }
  }
}
