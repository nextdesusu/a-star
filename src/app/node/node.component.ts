import { Component, OnInit, Input } from '@angular/core';
import { AStarNode } from "../../a-star/types";

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css']
})
export class NodeComponent implements OnInit {
  @Input() nodeProperties: AStarNode;
  constructor() { }

  ngOnInit(): void {
  }

}
