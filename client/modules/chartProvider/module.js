/**
@module SVGChartProvider
@description Lorem ipsum dolor sit amet consectetur adipisicing elit.
Architecto quos voluptates accusantium mollitia odit est ullam cumque dignissimos amet.
Quo dolor labore autem quia porro, illum odit necessitatibus provident nulla. 
*/
import { SVGChart } from "./component.js";

define("SVGChartProvider", [], function(a){
    customElements.define("svg-chart", SVGChart);
    
    return {
        SVGChart: SVGChart
    }
})
