import {Statistics} from "../statistics";
import cytoscape from "cytoscape";

export class StatisticsNaive extends Statistics {
    maxLevelOfRecursion: number;
    nrOfSearchIterations: number;

    constructor(cy: cytoscape.Core) {
        super(cy);
        this.maxLevelOfRecursion = 0;
        this.nrOfSearchIterations = 0;
    }

}