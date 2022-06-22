"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.taskFunctions = void 0;

var _pubsub = require("./pubsub");

var _general = require("./general");

var taskFunctions = function () {
  // Factories
  var factory = function factory(title, description, dueDate, priority, project) {
    var status = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'incomplete';
    var data = {
      "title": title,
      "description": description,
      "dueDate": dueDate,
      "priority": priority,
      "project": project,
      "status": status
    };

    var getDescription = function getDescription() {
      return data.description ? data.description : "";
    };

    var setDescription = function setDescription(value) {
      return data.description = value;
    };

    var getDueDate = function getDueDate() {
      return data.dueDate ? data.dueDate : 'no date';
    };

    var setDueDate = function setDueDate(value) {
      return data.dueDate = value;
    };

    var getPriority = function getPriority() {
      return data.priority ? data.priority : 'low';
    };

    var setPriority = function setPriority(value) {
      return data.priority = value;
    };

    var getProject = function getProject() {
      return data.project ? data.project : '';
    };

    var setProject = function setProject(value) {
      return data.project = value;
    };

    var getStatus = function getStatus() {
      return data.status;
    };

    var toggleStatus = function toggleStatus() {
      if (data.status === 'incomplete') {
        data.status = 'complete';
      } else {
        data.status = 'incomplete';
      }
    };

    var baseMethods = {
      getDescription: getDescription,
      setDescription: setDescription,
      getDueDate: getDueDate,
      setDueDate: setDueDate,
      getPriority: getPriority,
      setPriority: setPriority,
      getProject: getProject,
      setProject: setProject,
      getStatus: getStatus,
      toggleStatus: toggleStatus
    };
    return Object.assign({}, _general.generalFunctions.titleMethods(data), baseMethods);
  }; // Private variables/functions


  var _storageAvail = false;

  var _convertTasksListForStorage = function _convertTasksListForStorage(array) {
    var newTasksArray = [];

    for (var i = 0; i < array.length; i++) {
      var object = {
        "title": array[i].getTitle(),
        "description": array[i].getDescription(),
        "dueDate": array[i].getDueDate(),
        "priority": array[i].getPriority(),
        "project": array[i].getProject(),
        "status": array[i].getStatus()
      };
      newTasksArray.push(object);
    }

    return newTasksArray;
  };

  var _storeTasksInJSON = function _storeTasksInJSON() {
    var storageTasks = _convertTasksListForStorage(tasks);

    var jsonTasks = JSON.stringify(storageTasks);
    localStorage.setItem('tasksList', jsonTasks);
  }; // Public variables/functions


  var tasks = [];

  var addTask = function addTask(object) {
    tasks.push(object);
    var data = {
      object: object,
      array: tasks
    };

    _pubsub.pubsub.publish('taskAdded', data); // If local storage is available then set the tasks to the local storage
    // but only after converting the tasks array into an array of the values


    if (_storageAvail) {
      _storeTasksInJSON();
    }
  };

  var filterTasksList = function filterTasksList(data) {
    // console.log(`value is ${data.value}`);
    var newTasks = tasks.filter(function (task) {
      return task.getProject() === data.value;
    });
    var filteredTaskData = {
      projectIndex: data.index,
      tasks: newTasks
    }; // console.log(newTasks);

    _pubsub.pubsub.publish('renderFilteredTasks', filteredTaskData);
  };

  var getTaskData = function getTaskData(index) {
    var data = tasks[index];

    _pubsub.pubsub.publish('editTaskPopulateForm', data);
  };

  var populateTasksFromStorage = function populateTasksFromStorage() {
    if (_storageAvail) {
      if (localStorage.getItem("tasksList")) {
        var tasksString = localStorage.getItem("tasksList"); // convert string to valid object

        var parsedTasks = JSON.parse(tasksString);

        for (var i = 0; i < parsedTasks.length; i++) {
          var task = factory(parsedTasks[i].title, parsedTasks[i].description, parsedTasks[i].dueDate, parsedTasks[i].priority, parsedTasks[i].project, parsedTasks[i].status);
          addTask(task);
        }
      }
    }
  };

  var pushTasksList = function pushTasksList() {
    _pubsub.pubsub.publish('renderAllTasks', tasks);
  };

  var removeTask = function removeTask(index) {
    tasks.splice(index, 1);

    if (_storageAvail) {
      _storeTasksInJSON();
    }
  };

  var submitNewTask = function submitNewTask(dataObject) {
    var data = dataObject;
    var task = factory(data.title, data.description, data.date, data.priority, data.project);
    addTask(task);

    _pubsub.pubsub.publish('postSubmitTask');
  };

  var updateTaskStorageAvail = function updateTaskStorageAvail(bool) {
    _storageAvail = bool;
  };

  var updateTask = function updateTask(index) {
    // console.log(`index is ${index}`);
    var object = tasks[index];
    var data = {
      object: object,
      array: tasks,
      index: index
    };

    _pubsub.pubsub.publish('taskAdded', data);

    if (_storageAvail) {
      _storeTasksInJSON();
    }
  };

  var updateTaskValues = function updateTaskValues(editData) {
    // console.log(editData);
    var task = tasks[editData.index];
    var values = editData.object;
    task.setTitle(values.title);
    task.setDescription(values.description);
    task.setDueDate(values.date);
    task.setPriority(values.priority);
    task.setProject(values.project);
    var data = {
      object: task,
      array: tasks,
      index: editData.index
    };

    _pubsub.pubsub.publish('taskAdded', data);

    _pubsub.pubsub.publish('postSubmitTask');

    if (_storageAvail) {
      _storeTasksInJSON();
    }
  };

  var toggleTaskStatus = function toggleTaskStatus(index) {
    tasks[index].toggleStatus();
  }; // PubSubs


  _pubsub.pubsub.subscribe('checkStorage', updateTaskStorageAvail);

  _pubsub.pubsub.subscribe('filterTasks', filterTasksList);

  _pubsub.pubsub.subscribe('getTask', getTaskData);

  _pubsub.pubsub.subscribe('pushTasks', pushTasksList);

  _pubsub.pubsub.subscribe('removeTask', removeTask);

  _pubsub.pubsub.subscribe('submitTask', submitNewTask);

  _pubsub.pubsub.subscribe('submitEditedTask', updateTaskValues);

  _pubsub.pubsub.subscribe('toggleTaskStatus', toggleTaskStatus);

  _pubsub.pubsub.subscribe('updateTask', updateTask);

  _pubsub.pubsub.subscribe('pageLoad', populateTasksFromStorage);

  return {
    factory: factory,
    tasks: tasks,
    addTask: addTask
  };
}();

exports.taskFunctions = taskFunctions;