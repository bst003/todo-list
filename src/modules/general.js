import { pubsub } from "./pubsub";


export const generalFunctions = (() => {

    
    // Private variables/functions


    // Public variables/functions

    const testFunction = (array) => {
        console.log(`The array has a length of: ${array.length}`);
    }

    pubsub.subscribe('taskAdded', testFunction);


    return {
    }

})();