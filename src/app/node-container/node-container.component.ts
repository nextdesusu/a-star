import { Component, OnInit } from '@angular/core';
import { NodeTable, AStarNode } from "../../a-star/types";

enum MouseButtons {
  left = 1,
  middle,
  right
}

@Component({
  selector: 'app-node-container',
  templateUrl: './node-container.component.html',
  styleUrls: ['./node-container.component.css']
})
export class NodeContainerComponent implements OnInit {
  NT: NodeTable = new NodeTable(16, true);
  constructor() { }

  ngOnInit(): void {
    this.NT.findPath();
  }

  onRightClick() {
    return false;
  }

  shouldMarkAsPath(node: AStarNode): boolean {
    if (node === this.NT.end || node === this.NT.start) {
      return false;
    }
    return this.NT.belongsToPath(node.x, node.y);
  }

  handleClick(event: any): void {
    event.preventDefault();
    const target = event.target;
    const sx: string | null = target.getAttribute("data-pos-x");
    const sy: string | null = target.getAttribute("data-pos-y");
    if (sx === null || sy === null) {
      return;
    }
    const x: number = Number(sx), y: number = Number(sy);
    console.log(x, ":", y);
    if (event.which === MouseButtons.left && !event.ctrlKey) {
      this.NT.setStartNode(x, y);
    } else if (event.which === MouseButtons.right) {
      this.NT.setEndNode(x, y);
    } else if (event.which === MouseButtons.left && event.ctrlKey) {
      const node: AStarNode = this.NT.nodeAt(x, y);
      if (node !== this.NT.end && node !== this.NT.start) {
        node.solid = !node.solid;
      }
    }
    this.NT.findPath();
  }
}
