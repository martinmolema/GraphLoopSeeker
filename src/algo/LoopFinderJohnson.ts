import {LoopFinderBase, NodePath, SetOfLoops} from "./LoopFinderBase";
import {StatisticsJohnson} from "../stats/StatisticsJohnson";
import cytoscape, {NodeSingular} from "cytoscape";

export class LoopFinderJohnson extends  LoopFinderBase<StatisticsJohnson> {

    constructor(cy: cytoscape.Core, stats: StatisticsJohnson) {
        super(cy, stats);
    }

    override get algo():string {
        return 'Johnson';
    }

    protected findAllLoops(): SetOfLoops {
        const sscs = this.cy?.elements().tarjanStronglyConnectedComponents();
        sscs?.components.forEach((component) => {
            if (component.nodes().length == 1) { return }
            console.log(component.nodes().map(n => n.id()).join('-'));
            component.nodes().forEach((node) => {
                const newpath = new Set<NodeSingular>();
                this.recursiveFindLoops(node, newpath, 1);
            });
        });
        return this.allLoops;
    }

    /**
     * Brute force travel all paths
     * @param node
     * @param currentPath
     * @param level
     */
    recursiveFindLoops(node: NodeSingular, currentPath: NodePath, level: number) {
        this.stats.maxLevelOfRecursion = Math.max(this.stats.maxLevelOfRecursion, level);
        this.stats.longestPath = Math.max(this.stats.longestPath, currentPath.size);
        this.stats.nrOfSearchIterations++;

        if (currentPath.has(node)) {
            this.addLoop(node, currentPath);
            return;
        }
        currentPath.add(node);

        const outgoers = node.outgoers('node');
        outgoers.forEach(n => {
            this.recursiveFindLoops(n, currentPath, level + 1);

        });

        currentPath.delete(node);
    }


}