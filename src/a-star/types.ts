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
  size: number;
  nodes: Array<AStarNode>;
  start: AStarNode;
  end: AStarNode;
  constructor(tableSize: number) {
    this.size = tableSize;
    this.nodes = new Array(tableSize * tableSize);
    for (let x = 0; x < tableSize; x += 1) {
      for (let y = 0; y < tableSize; y += 1) {
        this.nodes[y * tableSize + x] = {
          ancestor: null,
          neightbours: [],
          solid: false,
          visited: false,
          gWeight: Infinity,
          lWeight: Infinity,
          x,
          y
        };
      }
    }

    this.start = this.nodeAt(0, 0);
    this.end = this.nodeAt(tableSize - 1, tableSize - 1);
  }

  setStartNode(node: AStarNode) {
    this.start = node;
  }

  setEndNode(node: AStarNode) {
    this.end = node;
  }

  nodeAt(x, y): AStarNode {
    return this.nodes[y * this.size + x];
  }

  *[Symbol.iterator]() {
    for (const node of this.nodes) {
      yield node;
    }
  }
}
