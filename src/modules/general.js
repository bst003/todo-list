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

        const openModal = () => {
            modalObject.open();
        }

        return {
            modalObject,
            getOpenElement,
            getCloseElement,
            closeModal,
            openModal
        }

    }

    
    // Private variables/functions


    // Public variables/functions

    const taskModal = Modal('#add-task-modal', '#show-task-modal', '#add-task-modal .close');


    const titleMethods = (data) => ({
        getTitle : () => data.title ? data.title : "no title property",
        setTitle : (value) => data.title = value,
    });



    // PubSubs
    pubsub.subscribe('postSubmitTask', taskModal.closeModal );

    pubsub.subscribe('editTaskOpenModal', taskModal.openModal );


    return {
        taskModal,
        titleMethods
    }

})();