import {LoopFinderBase, NodePath, SetOfLoops} from "./LoopFinderBase";
import {StatisticsNaive} from "../stats/StatisticsNaive";
import cytoscape, {EdgeSingular, NodeSingular} from "cytoscape";

export class LoopFinderMartin extends LoopFinderBase<StatisticsNaive> {

    private allVisitedEdgesPerNode: Map<string, Set<EdgeSingular>>;

    constructor(cy: cytoscape.Core, stats: StatisticsNaive) {
        super(cy, stats);
        this.allVisitedEdgesPerNode = new Map<string, Set<EdgeSingular>>();
    }

    override get algo():string {
        return 'martin';
    }

    protected override findAllLoops(): SetOfLoops {
        const currentPath = new Set<NodeSingular>();
        this.nodesAsCollection?.forEach(n => {
            this.recursiveFindLoops(n, currentPath, 0);
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

        const id = node.id();

        if (currentPath.has(node)) {
            this.addLoop(node, currentPath);
            return;
        }
        currentPath.add(node);

        /** check if there is already a set available with visited outgoers (edges). if not, create it */

        if (!this.allVisitedEdgesPerNode.has(id)) {
            this.allVisitedEdgesPerNode.set(node.id(), new Set<cytoscape.EdgeSingular>());
        }
        const edgesVisited = this.allVisitedEdgesPerNode.get(id) || new Set<cytoscape.EdgeSingular>();
        const outgoers = node.outgoers('edge');
        const allNodesVisited = outgoers.length === edgesVisited.size;
        const nodeInAnotherPath = this.isNodeMemberOfAnExistingPath(node);

        const abort= allNodesVisited &&  (! nodeInAnotherPath);

        if (!abort ) {
            outgoers.forEach(edge => {
                edgesVisited.add(edge);

                const n: NodeSingular = edge.target();

                this.recursiveFindLoops(n, currentPath, level + 1);
            });
        }
        currentPath.delete(node);
    }

}