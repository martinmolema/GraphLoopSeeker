/**
 *
 *
 * literature: https://www.cs.tufts.edu/comp/150GA/homeworks/hw1/Johnson%2075.PDF
 */

import cytoscape, {EdgeDefinition, NodeDefinition} from 'cytoscape';
import {setStyling} from "./styling";
//@ts-ignore
import elk from 'cytoscape-elk';
import {NodePath, SetOfLoops} from "./algo/LoopFinderBase";
import {Statistics} from "./stats/statistics";
import {AlgorithmFactory} from "./algo/AlgorithmFactory";
import {GraphExampleSet5} from "./sets/graphExampleSet5";
import {SetOfNodesAndEdges} from "./sets/createNodesAndEdges";
import {GraphExampleSet6} from "./sets/graphExampleSet6";
import {GraphExampleSet1} from "./sets/graphExampleSet1";

cytoscape.use(elk);

let cy!: cytoscape.Core;

/** HTMLDivElement */
let elCytoscape;

function setup(set: SetOfNodesAndEdges): void {
    elCytoscape = document.getElementById("graph");

    cy = cytoscape({
        container: elCytoscape,
        elements: {
            nodes: createNodes(set),
            edges: createEdges(set),
        }
    });
    setStyling(cy);

    cy.layout({
        name: 'elk',
        elk: {
            algorithm: 'mrtree',
            'elk.direction': 'DOWN'
        }
    } as any).run();
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

/**
 * Updates the values in the HTML-file from the stats global var
 */
function updateStats(stats: Statistics, column: number) {
    const items = document.querySelectorAll('table tr td');
    items.forEach(item => {
        const textContent = item.textContent;
        const regex = new RegExp(`\\$([a-zA-Z_0-9]+):(${column})`, 'g');
        item.textContent = textContent.replace(regex, (match: string, p1: string): string => {
            const statKey = p1 as keyof Statistics;
            let value = stats[statKey];
            if (typeof value === 'number') {
                value = value.toLocaleString();
            }
            return String(value);
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

function setupEventhandlers(allLoopsFound: SetOfLoops): void {
    const loops = document.getElementById("loops-found");
    loops?.addEventListener('click', (event: PointerEvent) => {

        loops?.querySelectorAll('li').forEach(el => el.classList.remove('selected'))

        const element = event.target as HTMLLIElement;
        element.classList.add('selected');
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
    setup(GraphExampleSet1);
    const algo1 = AlgorithmFactory.create("naive", cy);
    const algo2 = AlgorithmFactory.create("martin", cy);
    if (algo1) {
        algo1.run();

        setupEventhandlers(algo1.allLoops);
        showLoops(algo1.allLoops);
        updateStats(algo1.stats, 1);
    }
    if (algo2) {
        algo2.run();
        updateStats(algo2.stats, 2);
    }
}
