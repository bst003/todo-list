import { pubsub } from "./pubsub";


export const generalFunctions = (() => {

    
    // Private variables/functions


    // Public variables/functions

    const taskModal = new RModal(document.getElementById('add-task-modal'), {
        dialogOpenClass: 'animate__fadeInDown',
        dialogCloseClass: 'animate__fadeOutUp'
    });


    const closeModal = ( event, modalObject ) => {

        console.log( modalObject );

        event.preventDefault();
        modalObject.close();
    };


    const openModal = ( event, modalObject ) => {
        
        console.log( modalObject );
        
        event.preventDefault();
        modalObject.open();
    };


    const titleMethods = (data) => ({
        getTitle : () => data.title ? data.title : "no title property",
    });



    // PubSubs


    return {
        taskModal,
        titleMethods
    }

})();