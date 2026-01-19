import {LoopFinderBase} from "./LoopFinderBase";
import {Statistics} from "../stats/statistics";
import {LoopFinderNaive} from "./LoopFinderNaive";
import cytoscape from "cytoscape";
import {StatisticsNaive} from "../stats/StatisticsNaive";
import {LoopFinderMartin} from "./LoopFinderMartin";
import {LoopFinderJohnson} from "./LoopFinderJohnson";
import {StatisticsJohnson} from "../stats/StatisticsJohnson";

export class AlgorithmFactory {
    static create(type: string, cy: cytoscape.Core): LoopFinderBase<Statistics>  | undefined {
        let stats: Statistics;
        switch(type) {
            case "naive":
                return new LoopFinderNaive(cy, new StatisticsNaive(cy));
            case "martin":
                return new LoopFinderMartin(cy, new StatisticsNaive(cy));
            case "johnson":
                return new LoopFinderJohnson(cy, new StatisticsJohnson(cy));
            default:
                return undefined;
        }
    }
}