import { pubsub } from "./pubsub";
import { generalFunctions } from "./general";
import uniqid from "uniqid";

export const taskFunctions = (() => {
  // Factories

  const factory = (
    id,
    title,
    description,
    dueDate,
    priority,
    project,
    status = "incomplete",
    timestamp
  ) => {
    const data = {
      id: id,
      title: title,
      description: description,
      dueDate: dueDate,
      priority: priority,
      project: project,
      status: status,
      timestamp: timestamp,
    };

    const getID = () => data.id;

    const getDescription = () => (data.description ? data.description : "");
    const setDescription = (value) => (data.description = value);

    const getDueDate = () => (data.dueDate ? data.dueDate : "no date");
    const setDueDate = (value) => (data.dueDate = value);

    const getPriority = () => (data.priority ? data.priority : "low");
    const setPriority = (value) => (data.priority = value);

    const getProject = () => (data.project ? data.project : "");
    const setProject = (value) => (data.project = value);

    const getStatus = () => data.status;

    // const getTimestamp = () => (data.timestamp ? data.timestamp : "");

    const toggleStatus = () => {
      if (data.status === "incomplete") {
        data.status = "complete";
      } else {
        data.status = "incomplete";
      }
    };

    const baseMethods = {
      getID,
      getDescription,
      setDescription,
      getDueDate,
      setDueDate,
      getPriority,
      setPriority,
      getProject,
      setProject,
      getStatus,
      toggleStatus,
    };

    return Object.assign(
      {},
      generalFunctions.titleMethods(data),
      generalFunctions.timestampMethods(data),
      baseMethods
    );
  };

  // Private variables/functions

  // let _storageAvail = false;

  const _convertTasksListForStorage = (array) => {
    const newTasksArray = [];

    for (let i = 0; i < array.length; i++) {
      const object = {
        title: array[i].getTitle(),
        description: array[i].getDescription(),
        dueDate: array[i].getDueDate(),
        priority: array[i].getPriority(),
        project: array[i].getProject(),
        status: array[i].getStatus(),
      };

      newTasksArray.push(object);
    }

    return newTasksArray;
  };

  const _formatTaskDataForDB = (task) => {
    console.log("timestamp: ");
    console.log(task.getTimestamp());

    const taskData = {
      id: task.getID(),
      title: task.getTitle(),
      description: task.getDescription(),
      dueDate: task.getDueDate(),
      priority: task.getPriority(),
      project: task.getProject(),
      status: task.getStatus(),
      timestamp: task.getTimestamp(),
    };

    return taskData;
  };

  // const _storeTasksInJSON = () => {
  //   const storageTasks = _convertTasksListForStorage(tasks);

  //   const jsonTasks = JSON.stringify(storageTasks);

  //   localStorage.setItem("tasksList", jsonTasks);
  // };

  // Public variables/functions

  const tasks = [];

  const addTask = (object) => {
    tasks.push(object);

    const data = {
      object: object,
      array: tasks,
    };

    pubsub.publish("taskAdded", data);

    // If local storage is available then set the tasks to the local storage
    // but only after converting the tasks array into an array of the values
    // if (_storageAvail) {
    //   _storeTasksInJSON();
    // }
  };

  const filterTasksList = (data) => {
    // console.log(`value is ${data.value}`);

    const newTasks = tasks.filter((task) => task.getProject() === data.value);

    const filteredTaskData = {
      projectIndex: data.index,
      tasks: newTasks,
    };

    // console.log(newTasks);

    pubsub.publish("renderFilteredTasks", filteredTaskData);
  };

  const getTaskData = (index) => {
    const data = tasks[index];

    pubsub.publish("editTaskPopulateForm", data);
  };

  // const populateTasksFromStorage = () => {
  //   if (_storageAvail) {
  //     if (localStorage.getItem("tasksList")) {
  //       const tasksString = localStorage.getItem("tasksList");

  //       // convert string to valid object
  //       const parsedTasks = JSON.parse(tasksString);

  //       for (let i = 0; i < parsedTasks.length; i++) {
  //         const task = factory(
  //           parsedTasks[i].title,
  //           parsedTasks[i].description,
  //           parsedTasks[i].dueDate,
  //           parsedTasks[i].priority,
  //           parsedTasks[i].project,
  //           parsedTasks[i].status
  //         );

  //         addTask(task);
  //       }
  //     }
  // }
  // };

  const pushTasksList = () => {
    pubsub.publish("renderAllTasks", tasks);
  };

  const removeTask = (index) => {
    const taskData = {
      id: tasks[index].getID(),
    };

    tasks.splice(index, 1);

    // if (_storageAvail) {
    //   _storeTasksInJSON();
    // }

    pubsub.publish("deleteTaskFromFirebase", taskData);
  };

  const submitNewTask = (dataObject) => {
    const data = dataObject;

    console.log(data.timestamp);
    console.log(!data.timestamp);

    if (!data.id) {
      data.id = uniqid() + uniqid();
    }

    if (!data.timestamp) {
      console.log("no timestamp found, leaving blank");
      data.timestamp = "";
    }

    const task = factory(
      data.id,
      data.title,
      data.description,
      data.date,
      data.priority,
      data.project,
      data.status,
      data.timestamp
    );

    addTask(task);

    const taskData = _formatTaskDataForDB(task);

    console.log(taskData);

    // Only add to DB if the task is missing a timestamp
    if (taskData.timestamp === "") {
      console.log("timestamp is blank for: " + taskData.id);
      pubsub.publish("saveTaskToFirebase", taskData);
    }

    pubsub.publish("postSubmitTask");
  };

  // const updateTaskStorageAvail = (bool) => {
  //   _storageAvail = bool;
  // };

  // const updateTask = (index) => {
  //   // console.log(`index is ${index}`);
  //   console.log("update task in tasks");

  //   const object = tasks[index];

  //   const data = {
  //     object: object,
  //     array: tasks,
  //     index: index,
  //   };

  //   // const taskData = {
  //   //   id: tasks[index].getID(),
  //   //   title: tasks[index].getTitle(),
  //   //   description: tasks[index].getDescription(),
  //   //   date: tasks[index].getDueDate(),
  //   //   priority: tasks[index].getPriority(),
  //   //   project: tasks[index].getProject(),
  //   //   status: tasks[index].getStatus(),
  //   //   timestamp: tasks[index].getTimestamp(),
  //   // };

  //   // pubsub.publish("editTaskInFirebase", taskData);
  //   pubsub.publish("taskAdded", data);

  //   // if (_storageAvail) {
  //   //   _storeTasksInJSON();
  //   // }
  // };

  const updateTaskValues = (editData) => {
    console.log(editData);

    const task = tasks[editData.index];

    if (editData.object) {
      const values = editData.object;

      task.setTitle(values.title);
      task.setDescription(values.description);
      task.setDueDate(values.date);
      task.setPriority(values.priority);
      task.setProject(values.project);
    }

    const data = {
      object: task,
      array: tasks,
      index: editData.index,
    };

    const taskData = {
      id: tasks[editData.index].getID(),
      title: tasks[editData.index].getTitle(),
      description: tasks[editData.index].getDescription(),
      date: tasks[editData.index].getDueDate(),
      priority: tasks[editData.index].getPriority(),
      project: tasks[editData.index].getProject(),
      status: tasks[editData.index].getStatus(),
      timestamp: tasks[editData.index].getTimestamp(),
    };

    pubsub.publish("editTaskInFirebase", taskData);

    pubsub.publish("taskAdded", data);
    pubsub.publish("postSubmitTask");

    // if (_storageAvail) {
    //   _storeTasksInJSON();
    // }
  };

  const toggleTaskStatus = (index) => {
    tasks[index].toggleStatus();
  };

  // PubSubs

  // pubsub.subscribe("checkStorage", updateTaskStorageAvail);

  pubsub.subscribe("filterTasks", filterTasksList);

  pubsub.subscribe("getTask", getTaskData);

  pubsub.subscribe("pushTasks", pushTasksList);

  pubsub.subscribe("removeTask", removeTask);

  pubsub.subscribe("submitTask", submitNewTask);

  pubsub.subscribe("submitEditedTask", updateTaskValues);

  pubsub.subscribe("toggleTaskStatus", toggleTaskStatus);

  // pubsub.subscribe("updateTask", updateTask);

  // pubsub.subscribe("pageLoad", populateTasksFromStorage);

  return {
    factory,
    tasks,
    addTask,
  };
})();
