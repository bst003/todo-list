"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.projectFunctions = void 0;

var _pubsub = require("./pubsub");

var _general = require("./general");

var projectFunctions = function () {
  // Factories
  var factory = function factory(title) {
    var data = {
      "title": title
    };
    return Object.assign({}, _general.generalFunctions.titleMethods(data));
  }; // Private variables/functions


  var _storageAvail = false;

  var _convertProjectsListForStorage = function _convertProjectsListForStorage(array) {
    var newProjectsArray = [];

    for (var i = 0; i < array.length; i++) {
      var object = {
        "title": array[i].getTitle()
      };
      newProjectsArray.push(object);
    }

    return newProjectsArray;
  };

  var _storeProjectsInJSON = function _storeProjectsInJSON() {
    var storageProjects = _convertProjectsListForStorage(projects);

    var jsonProjects = JSON.stringify(storageProjects);
    localStorage.setItem('projectsList', jsonProjects);
  }; // Public variables/functions


  var projects = [];

  var addProject = function addProject(object) {
    projects.push(object);
    var data = {
      object: object,
      array: projects
    };

    _pubsub.pubsub.publish('projectAdded', data);

    if (_storageAvail) {
      _storeProjectsInJSON();
    }
  };

  var populateProjectsFromStorage = function populateProjectsFromStorage() {
    if (_storageAvail) {
      if (localStorage.getItem("projectsList")) {
        var projectsString = localStorage.getItem("projectsList"); // convert string to valid object

        var parsedProjects = JSON.parse(projectsString);

        for (var i = 0; i < parsedProjects.length; i++) {
          var project = factory(parsedProjects[i].title);
          addProject(project);
        }
      }
    }
  };

  var removeProject = function removeProject(index) {
    projects.splice(index, 1);

    if (_storageAvail) {
      _storeProjectsInJSON();
    }
  };

  var submitNewProject = function submitNewProject(dataObject) {
    var data = dataObject;
    var project = factory(data.title);
    addProject(project);

    _pubsub.pubsub.publish('postSubmitProject');
  };

  var updateProjectStorageAvail = function updateProjectStorageAvail(bool) {
    _storageAvail = bool;
  }; // PubSubs


  _pubsub.pubsub.subscribe('checkStorage', updateProjectStorageAvail);

  _pubsub.pubsub.subscribe('removeProjectObject', removeProject);

  _pubsub.pubsub.subscribe('submitProject', submitNewProject);

  _pubsub.pubsub.subscribe('pageLoad', populateProjectsFromStorage);

  return {
    factory: factory,
    projects: projects,
    addProject: addProject
  };
}();

exports.projectFunctions = projectFunctions;