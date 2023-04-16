import { pubsub } from "./pubsub";
const modal = require("../../node_modules/rmodal/index.js");

export const generalFunctions = (() => {
  // Factories

  const Modal = (modalElement, openModalElement, closeModalElement) => {
    const modalObject = new modal(document.querySelector(modalElement), {
      dialogOpenClass: "animate__fadeInDown",
      dialogCloseClass: "animate__fadeOutUp",
    });

    const getModalElement = () => modalElement;
    const getOpenElement = () => openModalElement;
    const getCloseElement = () => closeModalElement;

    const closeModal = () => {
      modalObject.close();
    };

    const openModal = () => {
      modalObject.open();
    };

    return {
      modalObject,
      getModalElement,
      getOpenElement,
      getCloseElement,
      closeModal,
      openModal,
    };
  };

  // Private variables/functions

  // Public variables/functions

  const projectModal = Modal(
    "#add-project-modal",
    "#show-project-modal",
    "#add-project-modal .close"
  );
  const taskModal = Modal(
    "#add-task-modal",
    "#show-task-modal",
    "#add-task-modal .close"
  );

  const activateModals = () => {
    pubsub.publish("activateProjectModal", projectModal);
    pubsub.publish("activateTaskModal", taskModal);
  };

  const checkLocalStorage = () => {
    let storage = false;

    if (storageAvailable("localStorage")) {
      storage = true;
    }

    pubsub.publish("checkStorage", storage);
  };

  const storageAvailable = (type) => {
    let storage;
    try {
      storage = window[type];
      let x = "__storage_test__";
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        // everything except Firefox
        (e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === "QuotaExceededError" ||
          // Firefox
          e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
      );
    }
  };

  const titleMethods = (data) => ({
    getTitle: () => (data.title ? data.title : "no title property"),
    setTitle: (value) => (data.title = value),
  });

  // PubSubs
  pubsub.subscribe("postSubmitProject", projectModal.closeModal);

  pubsub.subscribe("postSubmitTask", taskModal.closeModal);

  pubsub.subscribe("editTaskOpenModal", taskModal.openModal);

  pubsub.subscribe("pageLoad", activateModals);

  // pubsub.subscribe('prePageLoad', checkLocalStorage );

  return {
    projectModal,
    taskModal,
    titleMethods,
  };
})();
