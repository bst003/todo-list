import { pubsub } from "./pubsub";
import { compareAsc, format } from "date-fns";

export const domFunctions = (() => {
  // Private variables/functions

  const _mainTitle = document.querySelector("#main-title");
  const _tasksList = document.querySelector("#tasks-list");
  const _projectsList = document.querySelector("#projects-list");
  const _projectsSelectValues = document.querySelector("#task-project");
  let _sortValue = "";
  // let _storageCheck = false;

  // Appending and Clearing Content

  const _appendChildren = (parent, childArray) => {
    childArray.forEach((child) => {
      parent.appendChild(child);
    });
  };

  const _clearContent = (parent) => {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  };

  // Creating Elements

  const _createIconButton = (array) => {
    const buttonClasses = array;
    buttonClasses.unshift("icon-button");

    const button = document.createElement("button");

    buttonClasses.forEach((buttonClass) => {
      button.classList.add(buttonClass);
    });

    return button;
  };

  const _createNoTaskMessage = (index) => {
    const message = document.createElement("div");
    message.setAttribute("class", "no-tasks");

    const para = document.createElement("p");
    para.innerText =
      "There are currently no tasks in this project. Would you like to delete this project?";

    const button = document.createElement("button");
    button.classList.add("btn", "delete-project");
    button.setAttribute("data-project-index", index);
    button.innerText = "Delete Project";

    button.addEventListener("click", _deleteProject);

    message.appendChild(para);
    message.appendChild(button);

    return message;
  };

  const _createProjectElement = (object, index) => {
    const project = document.createElement("button");
    project.setAttribute(`type`, "button");
    project.setAttribute(`data-index`, index);
    project.setAttribute(`data-value`, object.getTitle());
    project.innerText = object.getTitle();

    return project;
  };

  const _createProjectSelectElement = (object, index) => {
    const project = document.createElement("option");
    project.setAttribute(`data-index`, index);
    project.setAttribute(`value`, object.getTitle());
    project.innerText = object.getTitle();

    return project;
  };

  const _createTaskElement = (object, index, style = "standard") => {
    const task = document.createElement("div");
    task.setAttribute(`data-index`, index);
    task.classList.add(`task-item`, `status-${object.getStatus()}`);

    const priority = document.createElement("div");
    priority.classList.add(`priority`, `${object.getPriority()}`);

    const main = _createTaskElementMain(object);

    const project = document.createElement("div");
    project.classList.add("project");
    project.innerText = object.getProject();

    const date = document.createElement("div");
    date.classList.add("date");
    date.innerText = object.getDueDate();

    if (style !== "reduced") {
      const controls = document.createElement("div");
      controls.classList.add("controls");

      const buttonComplete = _createIconButton(["complete"]);
      const buttonEdit = _createIconButton(["edit"]);
      const buttonDelete = _createIconButton(["delete", "reverse"]);

      _appendChildren(controls, [buttonComplete, buttonEdit, buttonDelete]);

      _appendChildren(task, [priority, main, project, date, controls]);
    } else {
      _appendChildren(task, [priority, main, project, date]);
    }

    return task;
  };

  const _createTaskElementMain = (object) => {
    const appendElements = [];

    const main = document.createElement("div");
    main.classList.add(`main`);

    const title = document.createElement("p");
    title.classList.add("title");
    title.innerText = object.getTitle();

    appendElements.push(title);

    if (object.getDescription() !== "") {
      const description = document.createElement("p");
      description.innerText = object.getDescription();

      appendElements.push(description);
    }

    _appendChildren(main, appendElements);

    return main;
  };

  // Add or remove listeners

  const _addSingleTaskListener = (index, className, func) => {
    const button = document.querySelector(
      `.task-item[data-index="${index}"] .${className}`
    );

    button.addEventListener("click", func);
  };

  const _addAllTaskListeners = (className, func) => {
    const buttons = document.querySelectorAll(`.task-item .${className}`);

    buttons.forEach((button) => {
      button.addEventListener("click", func);
    });
  };

  const _removeSingleTaskListener = (index, className, func) => {
    const button = document.querySelector(
      `.task-item[data-index="${index}"] .${className}`
    );

    button.removeEventListener("click", func);
  };

  const _removeAllTaskListeners = (className, func) => {
    const buttons = document.querySelectorAll(`.task-item .${className}`);

    buttons.forEach((button) => {
      button.removeEventListener("click", func);
    });
  };

  const _addSingleTaskElementListeners = (index) => {
    _addSingleTaskListener(index, "complete", _toggleTaskElementStatus);
    _addSingleTaskListener(index, "delete", _deleteTaskElement);
    _addSingleTaskListener(index, "edit", _editTaskElement);
  };

  const _removeSingleTaskElementListeners = (index) => {
    _removeSingleTaskListener(index, "complete", _toggleTaskElementStatus);
    _removeSingleTaskListener(index, "delete", _deleteTaskElement);
    _removeSingleTaskListener(index, "edit", _editTaskElement);
  };

  // Project Related Functions

  const _deleteProject = (e) => {
    const button = e.target;
    const projectIndex = button.getAttribute("data-project-index");
    const showAll = document.querySelector("#show-all-tasks");

    pubsub.publish("removeProjectObject", projectIndex);

    button.removeEventListener("click", _deleteProject);

    _deleteProjectElement(projectIndex);

    _deleteProjectSelectOption(projectIndex);

    showAll.click();
  };

  const _deleteProjectElement = (index) => {
    const projectElement = document.querySelector(
      `#projects-list button[data-index="${index}"]`
    );

    projectElement.removeEventListener("click", _pushProjectFilterValue);

    _projectsList.removeChild(_projectsList.children[Number(index) + 1]);
  };

  const _deleteProjectSelectOption = (index) => {
    const projectSelect = document.querySelector("#task-project");

    // const projectSelectElement = projectSelect.querySelector(`option[data-index="${index}"]`);

    // projectElement.removeEventListener('click', _pushProjectFilterValue);

    projectSelect.removeChild(projectSelect.children[index]);
  };

  const _updateActiveProjectButton = (target) => {
    const projectButtons = document.querySelectorAll("#projects-list button");

    projectButtons.forEach((button) => {
      button.classList.remove("active");
    });

    target.classList.add("active");
  };

  // Task Related Functions
  const _toggleTaskElementStatus = (e) => {
    const taskIndex =
      e.target.parentElement.parentElement.getAttribute("data-index");

    pubsub.publish("toggleTaskStatus", taskIndex);

    pubsub.publish("updateTask", taskIndex);
  };

  const _deleteTaskElement = (e) => {
    const taskIndex =
      e.target.parentElement.parentElement.getAttribute("data-index");

    _removeSingleTaskElementListeners(taskIndex);

    _tasksList.removeChild(_tasksList.children[taskIndex]);

    _updateTaskElementIndexes(taskIndex);

    pubsub.publish("removeTask", taskIndex);
  };

  const _editTaskElement = (e) => {
    const taskModalHeader = document.querySelector(
      "#add-task-modal .h4 strong"
    );
    _clearContent(taskModalHeader);
    taskModalHeader.innerText = "Edit Task";

    const taskIndex =
      e.target.parentElement.parentElement.getAttribute("data-index");

    const taskForm = document.querySelector("#add-task-form");
    taskForm.setAttribute("data-edit-index", taskIndex);

    pubsub.publish("getTask", taskIndex);

    // _populateTaskFormValues(taskIndex);

    pubsub.publish("editTaskOpenModal");
  };

  const _updateTaskElementIndexes = (index) => {
    for (let i = index; i < _tasksList.children.length; i++) {
      const y = Number(i) + 1;

      const taskElement = document.querySelector(
        `.task-item[data-index="${y}"]`
      );

      taskElement.setAttribute("data-index", i);
    }
  };

  // Form Related Functions

  const _gatherProjectFormValues = () => {
    const title = document.querySelector("#project-title").value;

    const data = {
      title,
    };

    return data;
  };

  const _resetProjectFormValues = () => {
    document.querySelector("#project-title").value = "";
  };

  const _submitProjectForm = (e) => {
    e.preventDefault();

    const data = _gatherProjectFormValues();

    pubsub.publish("submitProject", data);

    _resetProjectFormValues();
  };

  const _gatherTaskFormValues = () => {
    const title = document.querySelector("#task-title").value;
    const description = document.querySelector("#task-description").value;
    const date = format(
      new Date(document.querySelector("#task-due-date").value),
      "MM-dd-yyyy"
    );
    const priority = document.querySelector("#task-priority").value;
    const project = document.querySelector("#task-project").value;

    const data = {
      title,
      description,
      date,
      priority,
      project,
    };

    return data;
  };

  const _resetTaskFormValues = () => {
    document.querySelector("#task-title").value = "";
    document.querySelector("#task-description").value = "";
    document.querySelector("#task-due-date").value = "";
    document.querySelector("#task-priority").value = "";
    document.querySelector("#task-project").value = "";
  };

  const _resetTaskFormHeading = () => {
    const formHeading = document.querySelector("#add-task-modal .h4 strong");

    if (formHeading.innerText != "Add Task") {
      _clearContent(formHeading);
      formHeading.innerText = "Add Task";
    }
  };

  const _submitTaskForm = (e) => {
    e.preventDefault();

    const form = e.target;

    const data = _gatherTaskFormValues();

    if (form.getAttribute("data-edit-index")) {
      const index = form.getAttribute("data-edit-index");

      const updateData = {
        object: data,
        index: index,
      };

      pubsub.publish("submitEditedTask", updateData);
    } else {
      pubsub.publish("submitTask", data);
    }

    _resetTaskFormValues();
    form.removeAttribute("data-edit-index");
  };

  // Retrieving/Pushing Data

  const _triggerTasksListPush = (e) => {
    _sortValue = "";

    const target = e.target;

    _mainTitle.innerText = `All Tasks`;

    _updateActiveProjectButton(target);

    pubsub.publish("pushTasks");
  };

  const _pushProjectFilterValue = (e) => {
    const project = e.target;

    const projectIndex = project.getAttribute("data-index");
    const projectValue = project.getAttribute("data-value");

    const data = {
      index: projectIndex,
      value: projectValue,
    };

    _sortValue = projectValue;

    _mainTitle.innerText = `${projectValue} Tasks`;

    _updateActiveProjectButton(project);

    pubsub.publish("filterTasks", data);
  };

  // Public variables/functions

  // Rendering and removing elements

  const removeTaskElements = () => {
    removeTaskElementsListeners();
    _clearContent(_tasksList);
  };

  const renderFilteredTasksContent = (object) => {
    if (object.tasks.length === 0) {
      const message = _createNoTaskMessage(object.projectIndex);

      _tasksList.appendChild(message);

      return;
    }

    renderTasksListReduced(object.tasks);
  };

  const renderProject = (data) => {
    const project = _createProjectElement(data.object, data.array.length - 1);

    project.addEventListener("click", _pushProjectFilterValue);

    _projectsList.appendChild(project);
  };

  const renderProjectSelectOption = (data) => {
    const projectOption = _createProjectSelectElement(
      data.object,
      data.array.length
    );

    _projectsSelectValues.appendChild(projectOption);
  };

  const renderTask = (data) => {
    if (_sortValue !== "" && data.object.getProject() === _sortValue) {
      const task = _createTaskElement(
        data.object,
        data.array.length - 1,
        "reduced"
      );

      _tasksList.appendChild(task);

      return;
    }

    if (_sortValue !== "" && data.object.getProject() !== _sortValue) {
      return;
    }

    if (data.index === undefined) {
      const task = _createTaskElement(data.object, data.array.length - 1);

      _tasksList.appendChild(task);
      _addSingleTaskElementListeners(data.array.length - 1);

      return;
    }

    if (data.index !== undefined) {
      const task = _createTaskElement(data.object, data.index);

      _removeSingleTaskElementListeners(data.index);

      _tasksList.replaceChild(task, _tasksList.children[data.index]);
      _addSingleTaskElementListeners(data.index);

      return;
    }
  };

  const renderTasksList = (array) => {
    array.forEach((object, index) => {
      const task = _createTaskElement(object, index);

      _tasksList.appendChild(task);

      addTaskElementsListeners();
    });
  };

  const renderTasksListReduced = (array) => {
    array.forEach((object, index) => {
      const task = _createTaskElement(object, index, "reduced");

      _tasksList.appendChild(task);
    });
  };

  // Listener related functions

  const addProjectFormListener = () => {
    const form = document.querySelector("#add-project-modal form");

    form.addEventListener("submit", _submitProjectForm);
  };

  const addShowAllTasksListener = () => {
    const button = document.querySelector("#show-all-tasks");

    button.addEventListener("click", _triggerTasksListPush);
  };

  const addTaskFormListener = () => {
    const form = document.querySelector("#add-task-modal form");

    form.addEventListener("submit", _submitTaskForm);
  };

  const addTaskElementsListeners = () => {
    _addAllTaskListeners("complete", _toggleTaskElementStatus);
    _addAllTaskListeners("delete", _deleteTaskElement);
    _addAllTaskListeners("edit", _editTaskElement);
  };

  const removeTaskElementsListeners = () => {
    _removeAllTaskListeners("complete", _toggleTaskElementStatus);
    _removeAllTaskListeners("delete", _deleteTaskElement);
    _removeAllTaskListeners("edit", _editTaskElement);
  };

  // Google Auth Dom related function
  const userPic = document.querySelector("#user-pic");
  const userName = document.querySelector("#user-name");
  const signInButton = document.querySelector("#sign-in");
  const signOutButton = document.querySelector("#sign-out");

  const triggerGoogleSignIn = () => {
    pubsub.publish("triggerGoogleSignIn");
  };

  const addSignInListener = () => {
    signInButton.addEventListener("click", triggerGoogleSignIn);
  };

  const triggerGoogleSignOut = () => {
    pubsub.publish("triggerGoogleSignOut");
  };

  const addSignOutListener = () => {
    signOutButton.addEventListener("click", triggerGoogleSignOut);
  };

  const updateOnSignIn = (userData) => {
    console.log(userData);
  };

  const updateOnSignOut = () => {
    console.log("update data on sign out");
  };

  // Form related functions

  const populateTaskFormValues = (data) => {
    document.querySelector("#task-title").value = data.getTitle();
    document.querySelector("#task-description").value = data.getDescription();
    document.querySelector("#task-due-date").valueAsDate = new Date(
      data.getDueDate()
    );
    document.querySelector("#task-priority").value = data.getPriority();
    document.querySelector("#task-project").value = data.getProject();
  };

  // Modal related functions

  // Takes a modal object defined using the modal factory
  const setUpModal = (modal) => {
    const showModal = document.querySelector(modal.getOpenElement());
    const closeModal = document.querySelector(modal.getCloseElement());

    showModal.addEventListener("click", function (e) {
      modal.modalObject.open();

      const modalElement = document.querySelector(modal.getModalElement());

      if (modalElement.querySelector("form").getAttribute("data-edit-index")) {
        modalElement.querySelector("form").removeAttribute("data-edit-index");
      }

      _resetTaskFormHeading();
    });

    closeModal.addEventListener("click", function (e) {
      modal.modalObject.close();
      _resetTaskFormValues();
    });
  };

  // PubSubs

  pubsub.subscribe("editTaskPopulateForm", populateTaskFormValues);

  pubsub.subscribe("taskAdded", renderTask);

  pubsub.subscribe("projectAdded", renderProject);
  pubsub.subscribe("projectAdded", renderProjectSelectOption);

  pubsub.subscribe("activateProjectModal", setUpModal);
  pubsub.subscribe("activateTaskModal", setUpModal);

  pubsub.subscribe("renderAllTasks", removeTaskElements);
  pubsub.subscribe("renderAllTasks", renderTasksList);

  pubsub.subscribe("renderFilteredTasks", removeTaskElements);
  pubsub.subscribe("renderFilteredTasks", renderFilteredTasksContent);

  pubsub.subscribe("onGoogleSignIn", updateOnSignIn);
  pubsub.subscribe("onGoogleSignOut", updateOnSignOut);

  pubsub.subscribe("pageLoad", addShowAllTasksListener);
  pubsub.subscribe("pageLoad", addProjectFormListener);
  pubsub.subscribe("pageLoad", addTaskFormListener);
  pubsub.subscribe("pageLoad", addSignInListener);
  pubsub.subscribe("pageLoad", addSignOutListener);

  return {};
})();
