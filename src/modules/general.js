import { pubsub } from "./pubsub";


export const generalFunctions = (() => {

    // Factories

    const Modal = ( modalElement, openModalElement, closeModalElement ) => {

        const modalObject = new RModal(document.querySelector(modalElement), {
            dialogOpenClass: 'animate__fadeInDown',
            dialogCloseClass: 'animate__fadeOutUp'
        });

        const getOpenElement  = () => openModalElement;
        const getCloseElement  = () => closeModalElement;

        const closeModal = () => {
            modalObject.close();
        }

        return {
            modalObject,
            getOpenElement,
            getCloseElement,
            closeModal
        }

    }

    
    // Private variables/functions


    // Public variables/functions

    const taskModal = Modal('#add-task-modal', '#show-task-modal', '#add-task-modal .close');


    const titleMethods = (data) => ({
        getTitle : () => data.title ? data.title : "no title property",
    });



    // PubSubs
    pubsub.subscribe('postSubmitTask', taskModal.closeModal );


    return {
        taskModal,
        titleMethods
    }

})();