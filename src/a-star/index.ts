interface nodeTableArgs {
  tableSize: number;
  diagonal: boolean;
}

const manhattanHeuristic = (n1: AStarNode, n2: AStarNode): number => {
  const d1 = Math.abs(n2.x - n1.x);
  const d2 = Math.abs(n2.y - n1.y);
  return d1 + d2;
}

const diagonalHeuristic = (n1: AStarNode, n2: AStarNode): number => {
  const D = 1;
  const D2 = Math.sqrt(2);
  const d1 = Math.abs(n2.x - n1.x);
  const d2 = Math.abs(n2.y - n1.y);
  return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2));
}

export interface AStarNode {
  ancestor: AStarNode | null;
  visited: boolean;
  closed: boolean;
  solid: boolean;
  moveCost: number;
  gWeight: number;
  lWeight: number;
  h: number;
  x: number;
  y: number;
}

export class NodeTable {
  private constructedPath: Array<AStarNode>;
  private _size: number;
  private diagonal: boolean;
  private nodes: Array<AStarNode>;
  private dirtyNodes: Array<AStarNode>;
  private _start: AStarNode;
  private _end: AStarNode;
  private hFunc: (n1: AStarNode, n2: AStarNode) => number;
  constructor({ tableSize, diagonal }: nodeTableArgs) {
    this.constructedPath = [];
    this._size = tableSize;
    this.diagonal = diagonal;
    this.nodes = new Array(tableSize * tableSize);
    this.hFunc = diagonal ? diagonalHeuristic : manhattanHeuristic;
    this.fillWithNodes();
    this.dirtyNodes = [];

    this._start = this.nodeAt(0, 0);
    this._end = this.nodeAt(tableSize - 1, tableSize - 1);
  }

  private fillWithNodes(): void {
    for (let x = 0; x < this.size; x += 1) {
      for (let y = 0; y < this.size; y += 1) {
        const node: AStarNode = {
          ancestor: null,
          solid: false,
          visited: false,
          closed: false,
          gWeight: Infinity,
          lWeight: Infinity,
          moveCost: 1,
          h: -1,
          x,
          y
        };
        this.nodes[y * this.size + x] = node;
      }
    }
  }

  private cleanNode(node: AStarNode): void {
    node.gWeight = Infinity;
    node.lWeight = Infinity;
    node.visited = false;
    node.closed = false;
    node.ancestor = null;
    node.h = -1;
  }

  private cleanDirtyNodes(): void {
    for (const node of this.dirtyNodes) {
      this.cleanNode(node);
    }
    this.dirtyNodes = [];
  }

  private markAsDirty(node: AStarNode): void {
    this.dirtyNodes.push(node);
  }

  private reconstructPath() {
    this.constructedPath = [];
    let current = this.end;
    while (current.ancestor !== null) {
      current = current.ancestor;
      this.constructedPath.push(current);
    }
    this.constructedPath.reverse();
  }

  private *neighboursOf(node: AStarNode) {
    const { x, y } = node;
    if (x > 0) yield this.nodeAt(x - 1, y);
    if (y > 0) yield this.nodeAt(x, y - 1);
    if (x < this.size - 1) yield this.nodeAt(x + 1, y);
    if (y < this.size - 1) yield this.nodeAt(x, y + 1);
    if (this.diagonal) {
      if (x > 0 && y > 0) yield this.nodeAt(x - 1, y - 1);
      if (y > 0 && x < this.size - 1) yield this.nodeAt(x + 1, y - 1);
      if (x < this.size - 1 && y < this.size - 1) yield this.nodeAt(x + 1, y + 1);
      if (y < this.size - 1 && x > 0) yield this.nodeAt(x - 1, y + 1);
    }
  }

  belongsToPath(x: number, y: number): boolean {
    const node = this.nodeAt(x, y);
    return this.constructedPath.indexOf(node) !== -1;
  }

  changePathCost(x: number, y: number): void {
    const node = this.nodeAt(x, y);
    node.moveCost = (node.moveCost + 1) % 4;
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

  findPath() {
    this.cleanDirtyNodes();
    const { end, start } = this;

    //change costs to min heap!
    start.gWeight = 0;
    start.lWeight = 0;
    start.h = this.hFunc(start, end);
    start.visited = true;
    const costs: Array<AStarNode> = [start];
    while (costs.length > 0) {
      const current: AStarNode = costs.pop();
      if (current === end) {
        return this.reconstructPath();
      }
      current.closed = true;
      this.markAsDirty(current);
      for (const neighbour of this.neighboursOf(current)) {
        if (neighbour.solid || neighbour.closed) {
          continue;
        }
        this.markAsDirty(neighbour);
        const gWeight = current.gWeight + neighbour.moveCost;
        if (!neighbour.visited || gWeight < neighbour.gWeight) {
          neighbour.ancestor = current;
          neighbour.h = neighbour.h > - 1 ? neighbour.h : this.hFunc(neighbour, end);
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
    this.constructedPath = [];
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

  get isPathConstructed() {
    return this.constructedPath.length > 0;
  }
}
