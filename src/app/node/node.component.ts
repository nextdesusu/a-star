import { Component, OnInit, Input } from '@angular/core';
import { AStarNode } from "../../a-star/types";
import { NullTemplateVisitor } from '@angular/compiler';

interface NodeProps {
  ANode: AStarNode;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css']
})
export class NodeComponent implements OnInit {
  @Input() props: NodeProps; //nodeProperties: AStarNode;
  constructor() { }

  get buttonText(): string {
    const { gWeight, lWeight } = this.props.ANode;
    const gValue: string = isFinite(gWeight) ? String(gWeight) : "∞";
    const lValue: string = isFinite(lWeight) ? String(lWeight) : "∞";
    return `g: ${gValue}\nl: ${lValue}`;
  }

  get isStartNode(): boolean {
    const { ANode, startX, startY } = this.props;
    return ANode.x === startX && ANode.y === startY;
  }

  get isEndNode(): boolean {
    const { ANode, endX, endY } = this.props;
    return ANode.x === endX && ANode.y === endY;
  }

  ngOnInit(): void {
  }

}
