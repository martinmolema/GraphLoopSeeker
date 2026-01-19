import {createNodesAndEdges} from "./createNodesAndEdges";

const nrOfRepeatingNodesForTarjanWorstCase = 10;
/** Tarjan worst case */
export const GraphExampleSet3 = createNodesAndEdges([
    'E-A',
    'E-F',
    'H-C',
    'D-E', 'D-F',
    'G-F',
    'F-H-G',

    ...Array.from({length: nrOfRepeatingNodesForTarjanWorstCase}, (_, i) => `A-B${i}-C`),
    ...Array.from({length: nrOfRepeatingNodesForTarjanWorstCase}, (_, i) => `C-D${i}-E`),
    ...Array.from({length: nrOfRepeatingNodesForTarjanWorstCase}, (_, i) => `F-I${i}-G`),
]);