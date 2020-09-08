import { Component, OnInit } from '@angular/core';
import { AStarNode, NodeTable } from "../../a-star/types";

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

  handleClick(event: any) {
    const target = event.target;
    const x = target.getAttribute("data-pos-x");
    const y = target.getAttribute("data-pos-y");
    if (x !== null && y !== null) {
      const node = this.NT.nodeAt(Number(x), Number(y));
      console.log("node:", node);
    }
  }

}
