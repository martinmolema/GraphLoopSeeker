import cytoscape, {Collection, EdgeSingular, NodeSingular} from "cytoscape";
import {Statistics} from "../stats/statistics";

export type NodePath = Set<NodeSingular>;
export type SetOfLoops = Map<string, NodePath>;


export class LoopFinderBase<T extends Statistics> {
    private cy: cytoscape.Core;
    protected nodesAsCollection: Collection<NodeSingular>;
    protected edgesAsCollection: Collection<EdgeSingular>;

    protected nodeSet: Set<NodeSingular>;
    protected edgeSet: Set<EdgeSingular>;

    /** a Map of loops; each loop is identified by a lexicographically id consisting of all joined ID's of the nodes in the Set */
    public allLoops: SetOfLoops;

    /** a reverse lookup: the key is the ID of a node, and the NodePath value is a lexicographically shortest path */
    protected reverseLookupPaths: Map<string, SetOfLoops>;

    public stats: T;


    /**
     * Creates a new instance; will gather a list of edges and nodes, and convert them in a Set and Cytoscape collections
     * @param cy the cytoscape instance containing at least nodes and edges
     * @param stats an instance of the statistics to be gathered.
     */
    constructor(cy: cytoscape.Core, stats: T) {
        this.cy = cy;
        this.stats = stats;

        this.stats.update();

        this.nodesAsCollection = cy.nodes();
        this.edgesAsCollection = cy.edges();

        this.nodeSet = new Set<NodeSingular>();
        this.edgeSet = new Set<EdgeSingular>

        this.nodesAsCollection.forEach(n => {
            this.nodeSet.add(n)
        });
        this.edgesAsCollection.forEach(e => {
            this.edgeSet.add(e)
        });

        this.allLoops = new Map<string, NodePath>();
        this.reverseLookupPaths = new Map<string, SetOfLoops>();
        this.stats.algoName = this.algo;
    }

    get algo(): string {
        return '';
    }

    /**
     * Actually start looking for the loops; this should by overridden by other algo's.
     * @returns A set of loops or undefined in case of an exception.
     */
    public run(): SetOfLoops | undefined {
        this.stats.startTimer();
        try {
            const result = this.findAllLoops();
            this.stats.stopTimer();

            this.stats.nrOfLoopsFound = this.allLoops.size;
            return result;
        } catch (e) {
            console.warn(e);
            return undefined
        }
    }


    protected findAllLoops(): SetOfLoops {
        return this.allLoops;
    }

    /**
     * Add a loop to the set. The loop is lexicographically order by its ID's for easier comparison and making sure
     * the set (a MAP actually) of loops only contains unique paths.
     * @param startNode {NodeSingular}
     * @param newPath {Set<NodeSingular>}
     * @returns TRUE if a path/loop set was added, or FALSE if the path/loop already exists
     * @private
     */
    protected addLoop(startNode: NodeSingular, newPath: NodePath): boolean {
        const pathCopy = new Set<NodeSingular>(newPath);
        let head: NodeSingular | undefined;
        do {
            [head] = pathCopy;
            if (head && head !== startNode) {
                pathCopy.delete(head);
            }
        } while ((pathCopy.size > 0) && head !== startNode)

        // first make a copy so the calling party is not influenced
        const pathAsArray: NodeSingular[] = [...pathCopy];

        // now create all rotations
        const allRotations: Array<Array<NodeSingular>> = pathAsArray.map<NodeSingular[]>(
            (_: NodeSingular, index: number, list: NodeSingular[]) =>
                [...list.slice(index), ...list.slice(0, index)]
        );

        // order them by creating a unique string consisting of all joined id's of the nodes.
        allRotations.sort(
            (a: Array<NodeSingular>, b: Array<NodeSingular>) =>
                this.createUniqueIdFromNodeIDs(a).localeCompare(this.createUniqueIdFromNodeIDs(b))
        );

        // now that items are sorted we can simply take the first item of the array: this is the lexicographically first one
        const lexicographicallyFirstItem = allRotations[0] || [];

        // create the unique key
        const keyOfNewPath = this.createUniqueIdFromNodeIDs(lexicographicallyFirstItem);

        // if the key already exists in the map, skip it.
        if (this.allLoops.has(keyOfNewPath)) {
            return false;
        }

        // now create a new set and copy the path in the set.
        const newLexicographicalShortestPath = new Set<NodeSingular>(lexicographicallyFirstItem);

        // add the path to the reverse lookup table.
        [...newLexicographicalShortestPath].forEach(n => {
            const id = n.id();
            // make a new path where the given node is the first of the path
            const pathWithNodeAsFirstPart = this.rotatePathSoNodeIsFirst(n, newLexicographicalShortestPath);

            // get current set of paths or create a new one.
            let paths = this.reverseLookupPaths.get(n.id());
            if (!paths) {
                paths = new Map<string, NodePath>();
                this.reverseLookupPaths.set(id, paths);
            }
            if (pathWithNodeAsFirstPart) {
                paths.set(keyOfNewPath, pathWithNodeAsFirstPart);
            }


        });

        // add the new set to the Map of existing paths
        this.allLoops.set(keyOfNewPath, newLexicographicalShortestPath);
        return true;
    }

    /**
     * Creates a unique ID by simply joining all the ID's of the nodes in the path, separated by the '|' character
     * @param list
     * @private
     */
    private createUniqueIdFromNodeIDs(list: Array<NodeSingular>): string {
        return list.map(n => n.id()).join('|');
    }

    /**
     * Returns TRUE if a node is already in one of the found paths.
     * @param node
     * @protected
     */
    protected isNodeMemberOfAnExistingPath(node: NodeSingular): boolean {
        return this.reverseLookupPaths.has(node.id());
    }

    /**
     * Returns all paths the given node is part of.
     * @param node
     * @returns undefined if node cannot be found in the list of current paths.
     * @protected
     */
    protected findNodeInExistingPath(node: NodeSingular): Map<string, NodePath> | undefined {
        return this.reverseLookupPaths.get(node.id());
    }

    protected rotatePathSoNodeIsFirst(node: NodeSingular, path: NodePath): NodePath | undefined {
        const arr = [...path];
        const id = node.id();
        const p = arr.findIndex(n => n.id() === id);
        if (p !== -1) {
            const newArr = [...arr.slice(p), ...arr.slice(0, p)];

            return new Set<cytoscape.NodeSingular>(newArr);
        }
        return undefined;
    }

    protected debugOutputPathToConsole(path: NodePath): void {
        console.log([...path].map(n => n.id()).join('-'));
    }
}