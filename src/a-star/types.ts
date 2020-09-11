export interface AStarNode {
  ancestor: AStarNode | null;
  neightbours: Array<AStarNode>;
  visited: boolean;
  solid: boolean;
  gWeight: number;
  lWeight: number;
  x: number;
  y: number;
}

export class NodeTable {
  private _size: number;
  private nodes: Array<AStarNode>;
  private _start: AStarNode;
  private _end: AStarNode;
  constructor(tableSize: number) {
    this._size = tableSize;
    this.nodes = new Array(tableSize * tableSize);
    for (let x = 0; x < tableSize; x += 1) {
      for (let y = 0; y < tableSize; y += 1) {
        const node: AStarNode = {
          ancestor: null,
          neightbours: [],
          solid: false,
          visited: false,
          gWeight: Infinity,
          lWeight: Infinity,
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

  setNeighbours(node: AStarNode) {
    const { x, y } = node;
    if (x > 0) {
      node.neightbours.push(this.nodeAt(x - 1, y));
    }
    if (y > 0) {
      node.neightbours.push(this.nodeAt(x, y - 1));
    }
    if (x < this.size - 1) {
      node.neightbours.push(this.nodeAt(x + 1, y));
    }
    if (y < this.size - 1) {
      node.neightbours.push(this.nodeAt(x, y + 1));
    }
  }

  findPath() {
    const heuristic = () => {

    }

    const d = (n1, n2): number => {
      return 1;
    }
    /*
    const sortCosts = (costsArray: Array<AStarNode>): void => {
      costsArray.sort((n1: AStarNode, n2: AStarNode) => n1.lWeight - n2.lWeight);
    }
    */

    const { end, start } = this;
    //change costs to min heap!
    start.gWeight = 0;
    start.lWeight = 0;
    const costs: Array<AStarNode> = [start];
    while (costs.length > 0) {
      const current: AStarNode = costs.pop();
      current.visited = true;

      this.setNeighbours(current);
      for (const neighbour of current.neightbours) {
        const tentativeGweight = current.gWeight + d(current, neighbour);
        if (tentativeGweight < neighbour.gWeight) {

        }
      }
    }
  }
}
