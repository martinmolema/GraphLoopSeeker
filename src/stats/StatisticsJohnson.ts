import {Statistics} from "./statistics";
import cytoscape from "cytoscape";

export class StatisticsJohnson extends Statistics {

    constructor(cy: cytoscape.Core) {
        super(cy);
    }
}