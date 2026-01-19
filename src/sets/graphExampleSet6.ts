import {SetOfNodesAndEdges} from "./createNodesAndEdges";

export const GraphExampleSet2: SetOfNodesAndEdges = {
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