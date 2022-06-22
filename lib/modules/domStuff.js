"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.domFunctions = void 0;

var _pubsub = require("./pubsub");

var _dateFns = require("date-fns");

var domFunctions = function () {
  // Private variables/functions
  var _mainTitle = document.querySelector('#main-title');

  var _tasksList = document.querySelector('#tasks-list');

  var _projectsList = document.querySelector('#projects-list');

  var _projectsSelectValues = document.querySelector('#task-project');

  var _sortValue = ''; // let _storageCheck = false;
  // Appending and Clearing Content

  var _appendChildren = function _appendChildren(parent, childArray) {
    childArray.forEach(function (child) {
      parent.appendChild(child);
    });
  };

  var _clearContent = function _clearContent(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }; // Creating Elements


  var _createIconButton = function _createIconButton(array) {
    var buttonClasses = array;
    buttonClasses.unshift('icon-button');
    var button = document.createElement('button');
    buttonClasses.forEach(function (buttonClass) {
      button.classList.add(buttonClass);
    });
    return button;
  };

  var _createNoTaskMessage = function _createNoTaskMessage(index) {
    var message = document.createElement('div');
    message.setAttribute('class', 'no-tasks');
    var para = document.createElement('p');
    para.innerText = 'There are currently no tasks in this project. Would you like to delete this project?';
    var button = document.createElement('button');
    button.classList.add('btn', 'delete-project');
    button.setAttribute('data-project-index', index);
    button.innerText = 'Delete Project';
    button.addEventListener('click', _deleteProject);
    message.appendChild(para);
    message.appendChild(button);
    return message;
  };

  var _createProjectElement = function _createProjectElement(object, index) {
    var project = document.createElement('button');
    project.setAttribute("type", 'button');
    project.setAttribute("data-index", index);
    project.setAttribute("data-value", object.getTitle());
    project.innerText = object.getTitle();
    return project;
  };

  var _createProjectSelectElement = function _createProjectSelectElement(object, index) {
    var project = document.createElement('option');
    project.setAttribute("data-index", index);
    project.setAttribute("value", object.getTitle());
    project.innerText = object.getTitle();
    return project;
  };

  var _createTaskElement = function _createTaskElement(object, index) {
    var style = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'standard';
    var task = document.createElement('div');
    task.setAttribute("data-index", index);
    task.classList.add("task-item", "status-".concat(object.getStatus()));
    var priority = document.createElement('div');
    priority.classList.add("priority", "".concat(object.getPriority()));

    var main = _createTaskElementMain(object);

    var project = document.createElement('div');
    project.classList.add('project');
    project.innerText = object.getProject();
    var date = document.createElement('div');
    date.classList.add('date');
    date.innerText = object.getDueDate();

    if (style !== 'reduced') {
      var controls = document.createElement('div');
      controls.classList.add('controls');

      var buttonComplete = _createIconButton(['complete']);

      var buttonEdit = _createIconButton(['edit']);

      var buttonDelete = _createIconButton(['delete', 'reverse']);

      _appendChildren(controls, [buttonComplete, buttonEdit, buttonDelete]);

      _appendChildren(task, [priority, main, project, date, controls]);
    } else {
      _appendChildren(task, [priority, main, project, date]);
    }

    return task;
  };

  var _createTaskElementMain = function _createTaskElementMain(object) {
    var appendElements = [];
    var main = document.createElement('div');
    main.classList.add("main");
    var title = document.createElement('p');
    title.classList.add('title');
    title.innerText = object.getTitle();
    appendElements.push(title);

    if (object.getDescription() !== '') {
      var description = document.createElement('p');
      description.innerText = object.getDescription();
      appendElements.push(description);
    }

    _appendChildren(main, appendElements);

    return main;
  }; // Add or remove listeners


  var _addSingleTaskListener = function _addSingleTaskListener(index, className, func) {
    var button = document.querySelector(".task-item[data-index=\"".concat(index, "\"] .").concat(className));
    button.addEventListener('click', func);
  };

  var _addAllTaskListeners = function _addAllTaskListeners(className, func) {
    var buttons = document.querySelectorAll(".task-item .".concat(className));
    buttons.forEach(function (button) {
      button.addEventListener('click', func);
    });
  };

  var _removeSingleTaskListener = function _removeSingleTaskListener(index, className, func) {
    var button = document.querySelector(".task-item[data-index=\"".concat(index, "\"] .").concat(className));
    button.removeEventListener('click', func);
  };

  var _removeAllTaskListeners = function _removeAllTaskListeners(className, func) {
    var buttons = document.querySelectorAll(".task-item .".concat(className));
    buttons.forEach(function (button) {
      button.removeEventListener('click', func);
    });
  };

  var _addSingleTaskElementListeners = function _addSingleTaskElementListeners(index) {
    _addSingleTaskListener(index, 'complete', _toggleTaskElementStatus);

    _addSingleTaskListener(index, 'delete', _deleteTaskElement);

    _addSingleTaskListener(index, 'edit', _editTaskElement);
  };

  var _removeSingleTaskElementListeners = function _removeSingleTaskElementListeners(index) {
    _removeSingleTaskListener(index, 'complete', _toggleTaskElementStatus);

    _removeSingleTaskListener(index, 'delete', _deleteTaskElement);

    _removeSingleTaskListener(index, 'edit', _editTaskElement);
  }; // Project Related Functions


  var _deleteProject = function _deleteProject(e) {
    var button = e.target;
    var projectIndex = button.getAttribute('data-project-index');
    var showAll = document.querySelector('#show-all-tasks');

    _pubsub.pubsub.publish('removeProjectObject', projectIndex);

    button.removeEventListener('click', _deleteProject);

    _deleteProjectElement(projectIndex);

    _deleteProjectSelectOption(projectIndex);

    showAll.click();
  };

  var _deleteProjectElement = function _deleteProjectElement(index) {
    var projectElement = document.querySelector("#projects-list button[data-index=\"".concat(index, "\"]"));
    projectElement.removeEventListener('click', _pushProjectFilterValue);

    _projectsList.removeChild(_projectsList.children[Number(index) + 1]);
  };

  var _deleteProjectSelectOption = function _deleteProjectSelectOption(index) {
    var projectSelect = document.querySelector('#task-project'); // const projectSelectElement = projectSelect.querySelector(`option[data-index="${index}"]`);
    // projectElement.removeEventListener('click', _pushProjectFilterValue);

    projectSelect.removeChild(projectSelect.children[index]);
  };

  var _updateActiveProjectButton = function _updateActiveProjectButton(target) {
    var projectButtons = document.querySelectorAll('#projects-list button');
    projectButtons.forEach(function (button) {
      button.classList.remove('active');
    });
    target.classList.add('active');
  }; // Task Related Functions


  var _toggleTaskElementStatus = function _toggleTaskElementStatus(e) {
    var taskIndex = e.target.parentElement.parentElement.getAttribute('data-index');

    _pubsub.pubsub.publish('toggleTaskStatus', taskIndex);

    _pubsub.pubsub.publish('updateTask', taskIndex);
  };

  var _deleteTaskElement = function _deleteTaskElement(e) {
    var taskIndex = e.target.parentElement.parentElement.getAttribute('data-index');

    _removeSingleTaskElementListeners(taskIndex);

    _tasksList.removeChild(_tasksList.children[taskIndex]);

    _updateTaskElementIndexes(taskIndex);

    _pubsub.pubsub.publish('removeTask', taskIndex);
  };

  var _editTaskElement = function _editTaskElement(e) {
    var taskModalHeader = document.querySelector('#add-task-modal .h4 strong');

    _clearContent(taskModalHeader);

    taskModalHeader.innerText = 'Edit Task';
    var taskIndex = e.target.parentElement.parentElement.getAttribute('data-index');
    var taskForm = document.querySelector('#add-task-form');
    taskForm.setAttribute('data-edit-index', taskIndex);

    _pubsub.pubsub.publish('getTask', taskIndex); // _populateTaskFormValues(taskIndex);


    _pubsub.pubsub.publish('editTaskOpenModal');
  };

  var _updateTaskElementIndexes = function _updateTaskElementIndexes(index) {
    for (var i = index; i < _tasksList.children.length; i++) {
      var y = Number(i) + 1;
      var taskElement = document.querySelector(".task-item[data-index=\"".concat(y, "\"]"));
      taskElement.setAttribute('data-index', i);
    }
  }; // Form Related Functions


  var _gatherProjectFormValues = function _gatherProjectFormValues() {
    var title = document.querySelector('#project-title').value;
    var data = {
      title: title
    };
    return data;
  };

  var _resetProjectFormValues = function _resetProjectFormValues() {
    document.querySelector('#project-title').value = '';
  };

  var _submitProjectForm = function _submitProjectForm(e) {
    e.preventDefault();

    var data = _gatherProjectFormValues();

    _pubsub.pubsub.publish('submitProject', data);

    _resetProjectFormValues();
  };

  var _gatherTaskFormValues = function _gatherTaskFormValues() {
    var title = document.querySelector('#task-title').value;
    var description = document.querySelector('#task-description').value;
    var date = (0, _dateFns.format)(new Date(document.querySelector('#task-due-date').value), 'MM-dd-yyyy');
    var priority = document.querySelector('#task-priority').value;
    var project = document.querySelector('#task-project').value;
    var data = {
      title: title,
      description: description,
      date: date,
      priority: priority,
      project: project
    };
    return data;
  };

  var _resetTaskFormValues = function _resetTaskFormValues() {
    document.querySelector('#task-title').value = '';
    document.querySelector('#task-description').value = '';
    document.querySelector('#task-due-date').value = '';
    document.querySelector('#task-priority').value = '';
    document.querySelector('#task-project').value = '';
  };

  var _resetTaskFormHeading = function _resetTaskFormHeading() {
    var formHeading = document.querySelector('#add-task-modal .h4 strong');

    if (formHeading.innerText != 'Add Task') {
      _clearContent(formHeading);

      formHeading.innerText = 'Add Task';
    }
  };

  var _submitTaskForm = function _submitTaskForm(e) {
    e.preventDefault();
    var form = e.target;

    var data = _gatherTaskFormValues();

    if (form.getAttribute('data-edit-index')) {
      var index = form.getAttribute('data-edit-index');
      var updateData = {
        object: data,
        index: index
      };

      _pubsub.pubsub.publish('submitEditedTask', updateData);
    } else {
      _pubsub.pubsub.publish('submitTask', data);
    }

    _resetTaskFormValues();

    form.removeAttribute('data-edit-index');
  }; // Retrieving/Pushing Data


  var _triggerTasksListPush = function _triggerTasksListPush(e) {
    _sortValue = '';
    var target = e.target;
    _mainTitle.innerText = "All Tasks";

    _updateActiveProjectButton(target);

    _pubsub.pubsub.publish('pushTasks');
  };

  var _pushProjectFilterValue = function _pushProjectFilterValue(e) {
    var project = e.target;
    var projectIndex = project.getAttribute('data-index');
    var projectValue = project.getAttribute('data-value');
    var data = {
      index: projectIndex,
      value: projectValue
    };
    _sortValue = projectValue;
    _mainTitle.innerText = "".concat(projectValue, " Tasks");

    _updateActiveProjectButton(project);

    _pubsub.pubsub.publish('filterTasks', data);
  }; // Public variables/functions
  // Rendering and removing elements


  var removeTaskElements = function removeTaskElements() {
    removeTaskElementsListeners();

    _clearContent(_tasksList);
  };

  var renderFilteredTasksContent = function renderFilteredTasksContent(object) {
    if (object.tasks.length === 0) {
      var message = _createNoTaskMessage(object.projectIndex);

      _tasksList.appendChild(message);

      return;
    }

    renderTasksListReduced(object.tasks);
  };

  var renderProject = function renderProject(data) {
    var project = _createProjectElement(data.object, data.array.length - 1);

    project.addEventListener('click', _pushProjectFilterValue);

    _projectsList.appendChild(project);
  };

  var renderProjectSelectOption = function renderProjectSelectOption(data) {
    var projectOption = _createProjectSelectElement(data.object, data.array.length);

    _projectsSelectValues.appendChild(projectOption);
  };

  var renderTask = function renderTask(data) {
    if (_sortValue !== '' && data.object.getProject() === _sortValue) {
      var task = _createTaskElement(data.object, data.array.length - 1, 'reduced');

      _tasksList.appendChild(task);

      return;
    }

    if (_sortValue !== '' && data.object.getProject() !== _sortValue) {
      return;
    }

    if (data.index === undefined) {
      var _task = _createTaskElement(data.object, data.array.length - 1);

      _tasksList.appendChild(_task);

      _addSingleTaskElementListeners(data.array.length - 1);

      return;
    }

    if (data.index !== undefined) {
      var _task2 = _createTaskElement(data.object, data.index);

      _removeSingleTaskElementListeners(data.index);

      _tasksList.replaceChild(_task2, _tasksList.children[data.index]);

      _addSingleTaskElementListeners(data.index);

      return;
    }
  };

  var renderTasksList = function renderTasksList(array) {
    array.forEach(function (object, index) {
      var task = _createTaskElement(object, index);

      _tasksList.appendChild(task);

      addTaskElementsListeners();
    });
  };

  var renderTasksListReduced = function renderTasksListReduced(array) {
    array.forEach(function (object, index) {
      var task = _createTaskElement(object, index, 'reduced');

      _tasksList.appendChild(task);
    });
  }; // Listener related functions


  var addProjectFormListener = function addProjectFormListener() {
    var form = document.querySelector('#add-project-modal form');
    form.addEventListener('submit', _submitProjectForm);
  };

  var addShowAllTasksListener = function addShowAllTasksListener() {
    var button = document.querySelector('#show-all-tasks');
    button.addEventListener('click', _triggerTasksListPush);
  };

  var addTaskFormListener = function addTaskFormListener() {
    var form = document.querySelector('#add-task-modal form');
    form.addEventListener('submit', _submitTaskForm);
  };

  var addTaskElementsListeners = function addTaskElementsListeners() {
    _addAllTaskListeners('complete', _toggleTaskElementStatus);

    _addAllTaskListeners('delete', _deleteTaskElement);

    _addAllTaskListeners('edit', _editTaskElement);
  };

  var removeTaskElementsListeners = function removeTaskElementsListeners() {
    _removeAllTaskListeners('complete', _toggleTaskElementStatus);

    _removeAllTaskListeners('delete', _deleteTaskElement);

    _removeAllTaskListeners('edit', _editTaskElement);
  }; // Form related functions


  var populateTaskFormValues = function populateTaskFormValues(data) {
    document.querySelector('#task-title').value = data.getTitle();
    document.querySelector('#task-description').value = data.getDescription();
    document.querySelector('#task-due-date').valueAsDate = new Date(data.getDueDate());
    document.querySelector('#task-priority').value = data.getPriority();
    document.querySelector('#task-project').value = data.getProject();
  }; // Modal related functions
  // Takes a modal object defined using the modal factory


  var setUpModal = function setUpModal(modal) {
    var showModal = document.querySelector(modal.getOpenElement());
    var closeModal = document.querySelector(modal.getCloseElement());
    showModal.addEventListener('click', function (e) {
      modal.modalObject.open();
      var modalElement = document.querySelector(modal.getModalElement());

      if (modalElement.querySelector('form').getAttribute('data-edit-index')) {
        modalElement.querySelector('form').removeAttribute('data-edit-index');
      }

      _resetTaskFormHeading();
    });
    closeModal.addEventListener('click', function (e) {
      modal.modalObject.close();

      _resetTaskFormValues();
    });
  }; // PubSubs


  _pubsub.pubsub.subscribe('editTaskPopulateForm', populateTaskFormValues);

  _pubsub.pubsub.subscribe('taskAdded', renderTask);

  _pubsub.pubsub.subscribe('projectAdded', renderProject);

  _pubsub.pubsub.subscribe('projectAdded', renderProjectSelectOption);

  _pubsub.pubsub.subscribe('activateProjectModal', setUpModal);

  _pubsub.pubsub.subscribe('activateTaskModal', setUpModal);

  _pubsub.pubsub.subscribe('renderAllTasks', removeTaskElements);

  _pubsub.pubsub.subscribe('renderAllTasks', renderTasksList);

  _pubsub.pubsub.subscribe('renderFilteredTasks', removeTaskElements);

  _pubsub.pubsub.subscribe('renderFilteredTasks', renderFilteredTasksContent);

  _pubsub.pubsub.subscribe('pageLoad', addShowAllTasksListener);

  _pubsub.pubsub.subscribe('pageLoad', addProjectFormListener);

  _pubsub.pubsub.subscribe('pageLoad', addTaskFormListener);

  return {};
}();

exports.domFunctions = domFunctions;