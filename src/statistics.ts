import cytoscape from "cytoscape";

export class Statistics  {
    nrOfNodes: number;
    nrOfEdges: number;
    longestPath: number;
    nrOfLoopsFound: number;
    cy: cytoscape.Core
    timer: Performance;
    startTime: number;
    stopTime: number;
    timeDifference: number;

    constructor(cy: cytoscape.Core) {
        this.nrOfNodes = 0;
        this.nrOfEdges = 0;
        this.longestPath = 0;
        this.nrOfLoopsFound = 0;
        this.cy = cy;
        this.update();
        this.timer = performance;
        this.startTime = 0;
        this.stopTime = 0;
        this.timeDifference = 0;
    }

    update(): void {
        this.nrOfEdges = this.cy.nodes().length;
        this.nrOfNodes = this.cy.edges().length;
    }

    public startTimer(): void {
        this.startTime = this.timer.now();
    }

    public stopTimer(): void {
        this.stopTime = this.timer.now();
        this.timeDifference = this.timerLength;
    }

    /**
     * Returns the number of milliseconds passed, including fractions
     */
    public get timerLength(): number {
        return this.stopTime - this.startTime;
    }

}