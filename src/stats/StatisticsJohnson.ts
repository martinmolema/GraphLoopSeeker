import {Statistics} from "./statistics";
import cytoscape from "cytoscape";

export class StatisticsJohnson extends Statistics {
    maxLevelOfRecursion: number = 0;
    nrOfSearchIterations: number = 0;

    constructor(cy: cytoscape.Core) {
        super(cy);
    }
}