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
  NT: NodeTable = new NodeTable(16);
  constructor() { }

  ngOnInit(): void {
  }

  onRightClick() {
    return false;
  }

  handleClick(event: any) {
    event.preventDefault();
    const target = event.target;
    const x = target.getAttribute("data-pos-x");
    const y = target.getAttribute("data-pos-y");
    if (x === null || y === null) {
      return;
    }
    console.log(x, ":", y);
    const node: AStarNode = this.NT.nodeAt(Number(x), Number(y));
    if (event.which === MouseButtons.left && !event.ctrlKey) {
      node.solid = false;
      this.NT.setStartNode(node);
    } else if (event.which === MouseButtons.right) {
      node.solid = false;
      this.NT.setEndNode(node);
    } else if (event.which === MouseButtons.left && event.ctrlKey) {
      if (node !== this.NT.end && node !== this.NT.start) {
        node.solid = !node.solid;
      }
    }
  }
}
