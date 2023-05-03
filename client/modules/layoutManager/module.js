/**
@module LayoutManaget
@description Lorem ipsum dolor sit amet consectetur adipisicing elit.
Architecto quos voluptates accusantium mollitia odit est ullam cumque dignissimos amet.
Quo dolor labore autem quia porro, illum odit necessitatibus provident nulla. 
*/
import { Layout } from "./component.js";

define("LayoutManaget", [], function(){
    customElements.define("layout-viewport", Layout);
    return {
        Layout: Layout
    }
})
