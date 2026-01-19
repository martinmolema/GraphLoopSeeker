import {LoopFinderBase, SetOfLoops} from "./LoopFinderBase";
import {StatisticsJohnson} from "../stats/StatisticsJohnson";
import cytoscape from "cytoscape";

export class LoopFinderJohnson extends  LoopFinderBase<StatisticsJohnson> {

    constructor(cy: cytoscape.Core, stats: StatisticsJohnson) {
        super(cy, stats);
    }


    protected findAllLoops(): SetOfLoops {
        return super.findAllLoops();
    }

}