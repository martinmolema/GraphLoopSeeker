export type SetComponentNodeType = { label: string, id: string }
export type SetComponentEdgeType = { source: string, target: string, id: string }
export type SetOfNodesAndEdges = { nodes: Array<SetComponentNodeType>, edges: Array<SetComponentEdgeType> }

export const set1 = createNodesAndEdges([
    'A-B-C-D-E-Z',
    'C-V',
    'C-P-Q-E',
    'B-D-F',
    'E-C'
]);

export const set2: SetOfNodesAndEdges = {
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

/** Tarjan worst case */
export const set3 = createNodesAndEdges([
    'A-B1-C',
    'A-B2-C',
    'A-B3-C',
    'A-B4-C',
    'A-B5-C',
    'A-B6-C',

    'E-A',
    'E-F',
    'H-C',
    'D-E','D-F',
    'G-F',
    'F-H-G',

    'C-D1-E',
    'C-D2-E',
    'C-D3-E',
    'C-D4-E',
    'C-D5-E',
    'C-D6-E',
    'C-D7-E',

    'F-I1-G',
    'F-I2-G',
    'F-I3-G',
    'F-I4-G',
    'F-I5-G',
    'F-I6-G',
    'F-I7-G',
    'F-I8-G',
    'F-I9-G',


]);

function createNodesAndEdges(paths: string[]): SetOfNodesAndEdges {
    const edges: Array<SetComponentEdgeType> = new Array<SetComponentEdgeType>();

    // use a set to create a unique list of nodes; later convert to array
    const nodeSet: Map<string, string> = new Map<string, string>();

    paths.forEach(path => {
        const parts = path.split('-');

        parts.forEach(p => nodeSet.set(`node-${p}`, p));

        for (let i = 0; i < parts.length - 1; i++) {
            const n1 = parts[i];
            const n2 = parts[i + 1];
            const edge = {
                source: `node-${n1}`,
                target: `node-${n2}`,
                id: `${n1}-${n2}`
            }
            edges.push(edge);
        }
    });

    const nodes:Array<SetComponentNodeType> = [...nodeSet].map(([id,label]) => ({id, label}));

    for(let key of nodeSet.keys()) {
        nodes.push({id: key, label: nodeSet.get(key) || ''})
    }

    return {
        nodes, edges
    }
}