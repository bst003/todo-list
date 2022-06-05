import { pubsub } from "./pubsub";


export const generalFunctions = (() => {

    
    // Private variables/functions


    // Public variables/functions

    const titleMethods = (data) => ({
        getTitle : () => data.title ? data.title : "no title property",
    });

    const testFunction = (array) => {
        console.log(`The array has a length of: ${array.length}`);
    }


    // PubSubs

    pubsub.subscribe('taskAdded', testFunction);


    return {
        titleMethods
    }

})();