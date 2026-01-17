/**
 *
 *
 * literature: https://www.cs.tufts.edu/comp/150GA/homeworks/hw1/Johnson%2075.PDF
 */

import cytoscape, {EdgeDefinition, NodeDefinition, NodeSingular,} from 'cytoscape';
import {set3, SetOfNodesAndEdges} from "./sets";
import {setStyling} from "./styling";
//@ts-ignore
import elk from 'cytoscape-elk';
import {NodePath, SetOfLoops} from "./algo/LoopFinderBase";
import {Statistics} from "./statistics";
import {AlgorithmFactory} from "./algo/AlgorithmFactory";

cytoscape.use(elk);

var cy!: cytoscape.Core;

/** HTMLDivElement */
var elCytoscape;

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
            algorithm:'layered',
            'elk.direction': 'RIGHT'
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
function updateStats(stats: Statistics) {
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
    setup(set3);

    const algo = AlgorithmFactory.create("naive", cy);
    if (algo) {
        algo.run();

        setupEventhandlers(algo.allLoops);
        updateStats(algo.stats);
        showLoops(algo.allLoops);
    }
}
