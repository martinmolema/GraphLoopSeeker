import {LoopFinderBase} from "./LoopFinderBase";
import {Statistics} from "../statistics";
import {LoopFinderNaive, StatisticsNaive} from "./LoopFinderNaive";
import cytoscape from "cytoscape";

export class AlgorithmFactory {
    static create(type: string, cy: cytoscape.Core): LoopFinderBase<Statistics>  | undefined {
        switch(type) {
            case "naive":
                const stats= new StatisticsNaive(cy);
                const algo = new LoopFinderNaive(cy, stats);
                return algo;
            default:
                return undefined;
        }
    }
}