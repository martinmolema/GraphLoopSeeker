/**
 *
 *
 * literature: https://www.cs.tufts.edu/comp/150GA/homeworks/hw1/Johnson%2075.PDF
 */
import cytoscape from 'cytoscape';
var cy;
var set1 = {
    nodes: [
        { label: 'A', id: 'node-a' },
        { label: 'B', id: 'node-b' },
        { label: 'C', id: 'node-c' },
        { label: 'D', id: 'node-d' },
        { label: 'E', id: 'node-e' },
        { label: 'F', id: 'node-f' },
        { label: 'Z', id: 'node-z' },
        { label: 'P', id: 'node-p' },
        { label: 'Q', id: 'node-q' },
        { label: 'V', id: 'node-v' },
    ],
    edges: [
        { source: 'node-a', target: 'node-b', id: 'a-b' },
        { source: 'node-b', target: 'node-d', id: 'b-d' },
        { source: 'node-b', target: 'node-c', id: 'a-c' },
        { source: 'node-c', target: 'node-d', id: 'c-d' },
        { source: 'node-c', target: 'node-p', id: 'c-p' },
        { source: 'node-c', target: 'node-v', id: 'c-v' },
        { source: 'node-d', target: 'node-f', id: 'd-f' },
        { source: 'node-d', target: 'node-e', id: 'd-e' },
        { source: 'node-e', target: 'node-c', id: 'e-c' },
        { source: 'node-e', target: 'node-z', id: 'e-z' },
        { source: 'node-f', target: 'node-e', id: 'f-e' },
        { source: 'node-p', target: 'node-q', id: 'p-q' },
        { source: 'node-q', target: 'node-e', id: 'q-e' },
    ]
};
var set2 = {
    nodes: [
        { label: 'A', id: 'node-a' },
        { label: 'B', id: 'node-b' },
        { label: 'C', id: 'node-c' },
    ],
    edges: [
        { source: 'node-a', target: 'node-b', id: 'a-b' },
        { source: 'node-a', target: 'node-c', id: 'a-c' },
        { source: 'node-b', target: 'node-a', id: 'b-a' },
        { source: 'node-b', target: 'node-c', id: 'b-c' },
        { source: 'node-c', target: 'node-b', id: 'c-b' },
    ],
};
const stats = {
    nrOfNodes: 0,
    nrOfEdges: 0,
    longestPath: 0,
    maxLevelOfRecursion: 0,
    nrOfSearchIterations: 0,
};
/** HTMLDivElement */
var elCytoscape;
function setup(set) {
    elCytoscape = document.getElementById("cytoscape");
    cy = cytoscape({
        container: elCytoscape,
        elements: {
            nodes: createNodes(set),
            edges: createEdges(set),
        }
    });
    setStyling();
    cy.layout({ name: 'cose', }).run();
}
/**
 * @param set {{nodes, edges}}
 * @returns { NodeSingular[]}
 */
function createNodes(set) {
    return set.nodes.map(n => {
        return {
            data: {
                id: n.id,
                label: n.label,
            }
        };
    });
}
/**
 * @param set {{nodes, edges}}
 * @returns { EdgeSingular[]}
 */
function createEdges(set) {
    return set.edges.map(n => {
        return {
            data: {
                id: n.id,
                source: n.source,
                target: n.target,
            }
        };
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
        .update();
}
var nodesVisitedWithAllOutgoersVisited = new Set();
function findLoops() {
    const nodes = cy.nodes();
    const currentPath = new Set();
    const existingPaths = new Set();
    nodes.forEach(n => {
        console.group(`Start investigating ${n.id()}`);
        recursiveFindLoops(n, currentPath, existingPaths, 0);
        console.groupEnd();
    });
}
/**
 *
 * @param node
 * @param currentPath
 * @param existingPaths
 * @param level
 */
function recursiveFindLoops(node, currentPath, existingPaths, level) {
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
        currentPath.delete(n);
    });
}
/**
 * @param startNode {NodeSingular}
 * @param newPath {Set<NodeSingular>}
 * @param existingPaths {Set<Set<NodeSingular>>}
 */
function addLoop(startNode, newPath, existingPaths) {
    const pathStr = [...newPath].map(n => n.data('label')).join('-');
    console.log(` # LOOP: ${pathStr}`);
    const pathCopy = new Set(...newPath);
    let head;
    do {
        [head] = pathCopy;
        if (head && head !== startNode) {
            pathCopy.delete(head);
        }
    } while ((pathCopy.size > 0) && head !== startNode);
    existingPaths.add(pathCopy);
}
/**
 * Updates the values in the HTML-file from the stats global var
 */
function updateStats() {
    const items = document.querySelectorAll('table tr td:nth-child(2)');
    items.forEach(item => {
        const textContent = item.textContent;
        item.textContent = textContent.replace(/\$([a-zA-Z_0-9]+)/g, (match, p1, offset, fullstring, groups) => {
            const statKey = p1;
            return String(stats[statKey]);
        });
    });
}
/******************************************************************************************************
 **************************** MAIN *********************************************************************
 *******************************************************************************************************
 */
window.onload = () => {
    setup(set1);
    findLoops();
    updateStats();
};
//# sourceMappingURL=index.js.map