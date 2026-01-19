import cytoscape, {NodeSingular} from "cytoscape";

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
    timeDifferenceStr:string;
    minDegree: number = 0;
    maxDegree: number = 0;
    minInDegree: number = 0;
    maxInDegree: number = 0;
    minOutDegree: number = 0;
    maxOutDegree: number = 0;


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
        this.timeDifferenceStr = '';
    }

    update(): void {
        this.nrOfEdges = this.cy.nodes().length;
        this.nrOfNodes = this.cy.edges().length;

        this.maxDegree = this.cy.nodes().maxDegree();
        this.minDegree = this.cy.nodes().minDegree();

        this.minInDegree = this.cy.nodes().minIndegree();
        this.maxInDegree = this.cy.nodes().maxIndegree();
        this.minOutDegree = this.cy.nodes().minOutdegree();
        this.maxOutDegree = this.cy.nodes().maxOutdegree();
    }

    public startTimer(): void {
        this.startTime = this.timer.now();
    }

    public stopTimer(): void {
        this.stopTime = this.timer.now();
        this.timeDifference = this.timerLength;
        this.timeDifferenceStr = this.timerLengthFormatted;
    }

    /**
     * Returns the number of milliseconds passed, including fractions
     */
    public get timerLength(): number {
        return this.stopTime - this.startTime;
    }

    public get timerLengthFormatted(): string {
        return this.timerLength.toLocaleString();
    }

}