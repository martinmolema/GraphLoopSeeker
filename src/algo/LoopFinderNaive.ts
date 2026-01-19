import {LoopFinderBase, NodePath, SetOfLoops} from "./LoopFinderBase";
import {NodeSingular} from "cytoscape";
import {StatisticsNaive} from "../stats/StatisticsNaive";

export class LoopFinderNaive extends LoopFinderBase<StatisticsNaive> {

    override findAllLoops(): SetOfLoops {
        const currentPath = new Set<NodeSingular>();
        this.nodesAsCollection?.forEach(n => {
            this.recursiveFindLoops(n, currentPath, 0);
        });
        return this.allLoops;
    }

    override get algo():string {
        return 'naive';
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