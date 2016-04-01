
import { MinHeap } from "../datastructures/MinHeap";
import { comparisonMapWith } from "../datastructures/utils";

import { MappedMap } from "../datastructures/MappedMap";

class BellmanFord {
  constructor(graph, startNodes) {
    this.graph = graph;
    this.visitedFrom = new MappedMap(null, graph.NodeKey);
    this.EdgeWeightRing = graph.EdgeWeightRing;
    this.queue = new MinHeap(comparisonMapWith("distance", this.EdgeWeightRing::compare));


    this._init(graph, startNodes);
  }

  _init(graph, startNodes) {
    for (let node of startNodes) {
      this.queue.add({ node, distance: graph.EdgeWeightRing.zero, from: null });
    }
  }


  visit(node) {

  }

  iterate() {
    const queueItem = this.queue.pop();
    if (queueItem) {
      if (!this.visitedFrom.has(queueItem.node)) {
        this.visitedFrom.set(queueItem.node, queueItem.from);
        this.visit(queueItem.node);
        for (let edge of this.graph.getEdgesFrom(queueItem.node)) {
          this.queue.add({
            node: edge.nodeTo,
            distance: this.EdgeWeightRing.add(queueItem.distance, edge.weight),
            from: queueItem.node
          })
        }
      }
      return true;
    } else {
      return false;
    }
  }

  iterateAll() {
    while (this.iterate()) {
    }
  }
}