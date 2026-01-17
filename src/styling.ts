import cytoscape from "cytoscape";

export function setStyling(cy:cytoscape.Core) {
    cy.style()
        .selector('node')
        .style({
            label: 'data(label)',
            width: '2em',
            height: '2em',
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
