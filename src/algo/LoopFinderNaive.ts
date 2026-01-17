import {LoopFinderBase, NodePath, SetOfLoops} from "./LoopFinderBase";
import cytoscape, {NodeSingular} from "cytoscape";
import {Statistics} from "../statistics";

export class StatisticsNaive extends Statistics {
    maxLevelOfRecursion: number;
    nrOfSearchIterations: number;

    constructor(cy: cytoscape.Core) {
        super(cy);
        this.maxLevelOfRecursion = 0;
        this.nrOfSearchIterations = 0;
    }
}

export class LoopFinderNaive extends LoopFinderBase<StatisticsNaive> {

    constructor(cy: cytoscape.Core, stats: StatisticsNaive) {
        super(cy, stats);
    }

    /**
     * Brute force find all loops.
     */
    override run(): SetOfLoops {
        const currentPath = new Set<NodeSingular>();
        const allLoopsFound = new Map<string, NodePath>();

        this.stats.update();

        try {
            this.nodesAsCollection?.forEach(n => {
                console.group(`Start investigating ${n.id()}`);
                this.recursiveFindLoops(n, currentPath, allLoopsFound, 0);
                console.groupEnd();
            });
        } catch (e) {
            console.log(e);
        }
        return this.allLoops;
    }

    /**
     *
     * @param node
     * @param currentPath
     * @param existingPaths
     * @param level
     */
    recursiveFindLoops(node: NodeSingular, currentPath: NodePath, existingPaths: Map<string, NodePath>, level: number) {
        this.stats.maxLevelOfRecursion = Math.max(this.stats.maxLevelOfRecursion, level);
        this.stats.longestPath = Math.max(this.stats.longestPath, currentPath.size);
        this.stats.nrOfSearchIterations++;

        const indent = ''.padStart(level * 2, ' ');

        console.log(`${indent} - (${level}) : ${node.data('label')}`);

        if (currentPath.has(node)) {
            this.addLoop(node, currentPath);
            return;
        }
        currentPath.add(node);

        const outgoers = node.outgoers('node');
        outgoers.forEach(n => {
            this.recursiveFindLoops(n, currentPath, existingPaths, level + 1);

        });

        currentPath.delete(node);
    }

}