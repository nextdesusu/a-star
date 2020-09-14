import { Component, OnInit, Input } from '@angular/core';
import { AStarNode } from "../../a-star";
import { NullTemplateVisitor } from '@angular/compiler';

interface NodeProps {
  ANode: AStarNode;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isInPath: boolean;
}

interface nodeClass {
  [key: string]: true;
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
    /*
    const { gWeight, lWeight } = this.props.ANode;
    const gValue: string = isFinite(gWeight) ? String(gWeight) : "∞";
    const lValue: string = isFinite(lWeight) ? String(lWeight) : "∞";
    return `g: ${gValue}\nl: ${lValue}`;
    */
    return String(this.props.ANode.moveCost);
  }

  get isStartNode(): boolean {
    const { ANode, startX, startY } = this.props;
    return ANode.x === startX && ANode.y === startY;
  }

  get isEndNode(): boolean {
    const { ANode, endX, endY } = this.props;
    return ANode.x === endX && ANode.y === endY;
  }

  get nodeClass(): nodeClass {
    if (this.isStartNode) {
      return { startNode: true };
    }
    if (this.isEndNode) {
      return { endNode: true };
    }
    if (this.props.ANode.solid) {
      return { solid: true };
    }
    if (this.props.isInPath) {
      return { pathNode: true };
    }
    if (this.props.ANode.visited) {
      return { visited: true };
    }
  }

  ngOnInit(): void {
  }

}
