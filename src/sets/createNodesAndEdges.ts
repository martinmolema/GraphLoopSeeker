export type SetComponentNodeType = { label: string, id: string }
export type SetComponentEdgeType = { source: string, target: string, id: string }
export type SetOfNodesAndEdges = { nodes: Array<SetComponentNodeType>, edges: Array<SetComponentEdgeType> }

export function createNodesAndEdges(paths: string[]): SetOfNodesAndEdges {
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

    const nodes: Array<SetComponentNodeType> = [...nodeSet].map(([id, label]) => ({id, label}));

    for (let key of nodeSet.keys()) {
        nodes.push({id: key, label: nodeSet.get(key) || ''})
    }

    return {
        nodes, edges
    }
}