"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generalFunctions = void 0;

var _pubsub = require("./pubsub");

// var modal = require('../../node_modules/rmodal/dist/rmodal.js');
// import { modal  } from '../../node_modules/rmodal/index.js';
var _require = require('../../node_modules/rmodal/index.js'),
    RModal = _require.RModal;

var generalFunctions = function () {
  // Factories
  var Modal = function Modal(modalElement, openModalElement, closeModalElement) {
    var modalObject = new RModal(document.querySelector(modalElement), {
      dialogOpenClass: 'animate__fadeInDown',
      dialogCloseClass: 'animate__fadeOutUp'
    });

    var getModalElement = function getModalElement() {
      return modalElement;
    };

    var getOpenElement = function getOpenElement() {
      return openModalElement;
    };

    var getCloseElement = function getCloseElement() {
      return closeModalElement;
    };

    var closeModal = function closeModal() {
      modalObject.close();
    };

    var openModal = function openModal() {
      modalObject.open();
    };

    return {
      modalObject: modalObject,
      getModalElement: getModalElement,
      getOpenElement: getOpenElement,
      getCloseElement: getCloseElement,
      closeModal: closeModal,
      openModal: openModal
    };
  }; // Private variables/functions
  // Public variables/functions


  var projectModal = Modal('#add-project-modal', '#show-project-modal', '#add-project-modal .close');
  var taskModal = Modal('#add-task-modal', '#show-task-modal', '#add-task-modal .close');

  var activateModals = function activateModals() {
    _pubsub.pubsub.publish('activateProjectModal', projectModal);

    _pubsub.pubsub.publish('activateTaskModal', taskModal);
  };

  var checkLocalStorage = function checkLocalStorage() {
    var storage = false;

    if (storageAvailable('localStorage')) {
      storage = true;
    }

    _pubsub.pubsub.publish('checkStorage', storage);
  };

  var storageAvailable = function storageAvailable(type) {
    var storage;

    try {
      storage = window[type];
      var x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return e instanceof DOMException && ( // everything except Firefox
      e.code === 22 || // Firefox
      e.code === 1014 || // test name field too, because code might not be present
      // everything except Firefox
      e.name === 'QuotaExceededError' || // Firefox
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') && // acknowledge QuotaExceededError only if there's something already stored
      storage && storage.length !== 0;
    }
  };

  var titleMethods = function titleMethods(data) {
    return {
      getTitle: function getTitle() {
        return data.title ? data.title : "no title property";
      },
      setTitle: function setTitle(value) {
        return data.title = value;
      }
    };
  }; // PubSubs


  _pubsub.pubsub.subscribe('postSubmitProject', projectModal.closeModal);

  _pubsub.pubsub.subscribe('postSubmitTask', taskModal.closeModal);

  _pubsub.pubsub.subscribe('editTaskOpenModal', taskModal.openModal);

  _pubsub.pubsub.subscribe('pageLoad', activateModals);

  _pubsub.pubsub.subscribe('prePageLoad', checkLocalStorage);

  return {
    projectModal: projectModal,
    taskModal: taskModal,
    titleMethods: titleMethods
  };
}();

exports.generalFunctions = generalFunctions;