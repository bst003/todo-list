import { pubsub } from "./pubsub";


export const generalFunctions = (() => {

    
    // Private variables/functions


    // Public variables/functions

    const titleMethods = (data) => ({
        getTitle : () => data.title ? data.title : "no title property",
    });

    // const submitNewTask = (e) => {

    //     e.preventDefault();

    //     const data = _gatherTaskFormValues();



    //     // pubsub.publish('submitTask', data );

    // }


    // PubSubs

    // pubsub.subscribe('submitTask', _gatherTaskFormValues);


    return {
        titleMethods
    }

})();