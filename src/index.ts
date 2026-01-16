/**
 *
 *
 * literature: https://www.cs.tufts.edu/comp/150GA/homeworks/hw1/Johnson%2075.PDF
 */
import cytoscape, {
    EdgeDefinition,
    NodeDefinition,
    NodeSingular,
} from 'cytoscape';

var cy!: cytoscape.Core;

type NodePath = Set<NodeSingular>;
var allLoopsFound: Map<string, NodePath>;

type SetComponentNodeType = { label: string, id: string }
type SetComponentEdgeType = { source: string, target: string, id: string }
type SetOfNodesAndEdges = { nodes: Array<SetComponentNodeType>, edges: Array<SetComponentEdgeType> }

var set1: SetOfNodesAndEdges = {

    nodes: [
        {label: 'A', id: 'node-a'},
        {label: 'B', id: 'node-b'},
        {label: 'C', id: 'node-c'},
        {label: 'D', id: 'node-d'},
        {label: 'E', id: 'node-e'},
        {label: 'F', id: 'node-f'},
        {label: 'Z', id: 'node-z'},
        {label: 'P', id: 'node-p'},
        {label: 'Q', id: 'node-q'},
        {label: 'V', id: 'node-v'},
    ],
    edges: [
        {source: 'node-a', target: 'node-b', id: 'a-b'},

        {source: 'node-b', target: 'node-d', id: 'b-d'},
        {source: 'node-b', target: 'node-c', id: 'a-c'},
        {source: 'node-c', target: 'node-d', id: 'c-d'},
        {source: 'node-c', target: 'node-p', id: 'c-p'},
        {source: 'node-c', target: 'node-v', id: 'c-v'},
        {source: 'node-d', target: 'node-f', id: 'd-f'},
        {source: 'node-d', target: 'node-e', id: 'd-e'},
        {source: 'node-e', target: 'node-c', id: 'e-c'},
        {source: 'node-e', target: 'node-z', id: 'e-z'},
        {source: 'node-f', target: 'node-e', id: 'f-e'},
        {source: 'node-p', target: 'node-q', id: 'p-q'},
        {source: 'node-q', target: 'node-e', id: 'q-e'},
    ]
}
var set2: SetOfNodesAndEdges = {
    nodes: [
        {label: 'A', id: 'node-a'},
        {label: 'B', id: 'node-b'},
        {label: 'C', id: 'node-c'},
    ],
    edges: [
        {source: 'node-a', target: 'node-b', id: 'a-b'},
        {source: 'node-a', target: 'node-c', id: 'a-c'},
        {source: 'node-b', target: 'node-a', id: 'b-a'},
        {source: 'node-b', target: 'node-c', id: 'b-c'},
        {source: 'node-c', target: 'node-b', id: 'c-b'},
    ],
};

type Statistics = {
    nrOfNodes: number;
    nrOfEdges: number;
    longestPath: number;
    maxLevelOfRecursion: number;
    nrOfSearchIterations: number;
    nrOfLoopsFound: number;
}

const stats: Statistics = {
    nrOfNodes: 0,
    nrOfEdges: 0,
    longestPath: 0,
    maxLevelOfRecursion: 0,
    nrOfSearchIterations: 0,
    nrOfLoopsFound: 0
}

/** HTMLDivElement */
var elCytoscape;

function setup(set: SetOfNodesAndEdges): void {
    elCytoscape = document.getElementById("cytoscape");

    stats.nrOfEdges = set.edges.length;
    stats.nrOfNodes = set.nodes.length

    cy = cytoscape({
        container: elCytoscape,
        elements: {
            nodes: createNodes(set),
            edges: createEdges(set),
        }
    });
    setStyling();
    cy.layout({name: 'cose',}).run();
}

/**
 * @param set {{nodes, edges}}
 * @returns { NodeSingular[]}
 */
function createNodes(set: SetOfNodesAndEdges): NodeDefinition[] {
    return set.nodes.map(n => {
        return {
            data: {
                id: n.id,
                label: n.label,
            }
        }
    });
}

/**
 * @param set {{nodes, edges}}
 * @returns { EdgeSingular[]}
 */
function createEdges(set: SetOfNodesAndEdges): EdgeDefinition[] {
    return set.edges.map(n => {
        return {
            data: {
                id: n.id,
                source: n.source,
                target: n.target,
            }
        }
    });
}

function setStyling() {
    cy.style()
        .selector('node')
        .style({
            label: 'data(label)',
            width: '6em',
            height: '6em',
            'text-valign': 'center',
            'text-halign': 'center',
            'text-wrap': 'wrap',
            'text-max-width': '6em',
            'shape': 'ellipse'
        })
        .selector('edge')
        .style({
            'line-color': '#555',
            'target-arrow-color': '#555',
            'target-arrow-shape': 'triangle',
            'curve-style': 'straight',
            'target-text-offset': 20,
            'source-text-offset': 20,
        })
        .selector('node.on-a-path')
        .style({
            "background-color":"red"
        })
        .update();

}

var nodesVisitedWithAllOutgoersVisited = new Set();

function findLoops() {
    const nodes = cy.nodes();
    const currentPath = new Set<NodeSingular>();
    allLoopsFound = new Map<string, NodePath>();

    try {
        nodes.forEach(n => {
            console.group(`Start investigating ${n.id()}`);
            recursiveFindLoops(n, currentPath, allLoopsFound, 0);
            console.groupEnd();
        });
    } catch (e) {
        console.log(e);
    }

    stats.nrOfLoopsFound = allLoopsFound.size;
    showLoops(allLoopsFound);
}

/**
 *
 * @param node
 * @param currentPath
 * @param existingPaths
 * @param level
 */
function recursiveFindLoops(node: NodeSingular, currentPath: NodePath, existingPaths: Map<string, NodePath>, level: number) {
    stats.maxLevelOfRecursion = Math.max(stats.maxLevelOfRecursion, level);
    stats.longestPath = Math.max(stats.longestPath, currentPath.size);
    stats.nrOfSearchIterations++;

    const indent = ''.padStart(level * 2, ' ');

    console.log(`${indent} - (${level}) : ${node.data('label')}`);

    if (currentPath.has(node)) {
        addLoop(node, currentPath, existingPaths);
        return;
    }
    currentPath.add(node);

    const outgoers = node.outgoers('node');
    outgoers.forEach(n => {
        recursiveFindLoops(n, currentPath, existingPaths, level + 1);

    });

    currentPath.delete(node);
}

/**
 * @param startNode {NodeSingular}
 * @param newPath {Set<NodeSingular>}
 * @param existingPaths {Set<Set<NodeSingular>>}
 */
function addLoop(startNode: NodeSingular, newPath: NodePath, existingPaths: Map<string, NodePath>) {
    const pathCopy = new Set<NodeSingular>(newPath);
    let head: NodeSingular | undefined;
    do {
        [head] = pathCopy;
        if (head && head !== startNode) {
            pathCopy.delete(head);
        }
    } while ((pathCopy.size > 0) && head !== startNode)

    const pathStr2 = [...pathCopy].map(n => n.data('label')).join('-');
    console.log(` # LOOP (shortened): ${pathStr2}`);

    const pathAsArray: NodeSingular[] = [...pathCopy];
    const allRotations: Array<Array<NodeSingular>> = pathAsArray.map<NodeSingular[]>(
        (_: NodeSingular, index: number, list: NodeSingular[]) =>
            [...list.slice(index), ...list.slice(0, index)]
    );

    allRotations.sort(
        (a: Array<NodeSingular>, b: Array<NodeSingular>) =>
            a.map(n => n.id()).join('|')
                .localeCompare(
                    b.map(n => n.id()).join('|')
                )
    );

    const newLexicographicalShortestPath = new Set<NodeSingular>(allRotations[0]);
    const keyOfNewPath = [...newLexicographicalShortestPath].map(n => n.id()).join('|');

    if (existingPaths.has(keyOfNewPath)) {
        return
    }

    existingPaths.set(keyOfNewPath, newLexicographicalShortestPath);
}

/**
 * Updates the values in the HTML-file from the stats global var
 */
function updateStats() {
    const items = document.querySelectorAll('table tr td:nth-child(2)');
    items.forEach(item => {
        const textContent = item.textContent;
        item.textContent = textContent.replace(/\$([a-zA-Z_0-9]+)/g, (match: string, p1: string): string => {
            const statKey = p1 as keyof Statistics;
            return String(stats[statKey]);
        });
    });
}

/**
 *
 * @param loops
 */
function showLoops(loops: Map<string, NodePath>): void {
    const container = document.getElementById("loops-found");
    if (!container) {
        return
    }

    const olElement: HTMLOListElement = document.createElement('ol');
    for (let key of loops.keys()) {
        const nodes = loops.get(key);
        if (nodes) {
            const listItem: HTMLLIElement = document.createElement('li');
            if (listItem) {
                olElement.appendChild(listItem);
                listItem.dataset.id = key;
                listItem.textContent = [...nodes].map(n => n.data('label')).join(' - ');
            }
        }
    }
    container.appendChild(olElement)
}

function setupEventhandlers(): void {
    const loops = document.getElementById("loops-found");
    loops?.addEventListener('click', (event: PointerEvent) => {
        const element = event.target as HTMLLIElement;
        const dataID = element.dataset.id || '';
        const path = allLoopsFound.get(dataID);

        cy.nodes().removeClass("on-a-path");
        path?.forEach(n => n.addClass('on-a-path'));

    });
}

/******************************************************************************************************
 **************************** MAIN *********************************************************************
 *******************************************************************************************************
 */


window.onload = () => {
    setup(set1);
    setupEventhandlers();
    findLoops();
    updateStats();
}
