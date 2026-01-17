import cytoscape from "cytoscape";

export class Statistics  {
    nrOfNodes: number;
    nrOfEdges: number;
    longestPath: number;
    nrOfLoopsFound: number;
    cy: cytoscape.Core

    constructor(cy: cytoscape.Core) {
        this.nrOfNodes = 0;
        this.nrOfEdges = 0;
        this.longestPath = 0;
        this.nrOfLoopsFound = 0;
        this.cy = cy;
        this.update();
    }

    update(): void {
        this.nrOfEdges = this.cy.nodes().length;
        this.nrOfNodes = this.cy.edges().length;
    }
}