import { pubsub } from "./pubsub";
import { generalFunctions } from "./general";
import uniqid from "uniqid";

export const projectFunctions = (() => {
  // Factories

  const factory = (id, title, timestamp) => {
    const data = {
      id: id,
      title: title,
      timestamp: timestamp,
    };

    const getID = () => data.id;

    const baseMethods = {
      getID,
    };

    return Object.assign(
      {},
      baseMethods,
      generalFunctions.titleMethods(data),
      generalFunctions.timestampMethods(data)
    );
  };

  // Private variables/functions

  //   let _storageAvail = false;

  //   const _convertProjectsListForStorage = (array) => {
  //     const newProjectsArray = [];

  //     for (let i = 0; i < array.length; i++) {
  //       const object = {
  //         title: array[i].getTitle(),
  //       };

  //       newProjectsArray.push(object);
  //     }

  //     return newProjectsArray;
  //   };

  //   const _storeProjectsInJSON = () => {
  //     const storageProjects = _convertProjectsListForStorage(projects);

  //     const jsonProjects = JSON.stringify(storageProjects);

  //     localStorage.setItem("projectsList", jsonProjects);
  //   };

  const _formatProjectDataForDB = (project) => {
    console.log("timestamp: ");
    console.log(project.getTimestamp());

    const projectData = {
      id: project.getID(),
      title: project.getTitle(),
      timestamp: project.getTimestamp(),
    };

    return projectData;
  };

  // Public variables/functions
  const projects = [];

  const addProject = (object) => {
    console.log(object);

    projects.push(object);

    const data = {
      object: object,
      array: projects,
    };

    pubsub.publish("projectAdded", data);

    // if (_storageAvail) {
    //   _storeProjectsInJSON();
    // }
  };

  //   const populateProjectsFromStorage = () => {
  //     if (_storageAvail) {
  //       if (localStorage.getItem("projectsList")) {
  //         const projectsString = localStorage.getItem("projectsList");

  //         // convert string to valid object
  //         const parsedProjects = JSON.parse(projectsString);

  //         for (let i = 0; i < parsedProjects.length; i++) {
  //           const project = factory(parsedProjects[i].title);

  //           addProject(project);
  //         }
  //       }
  //     }
  //   };

  const removeProject = (index) => {
    const projectData = {
      id: projects[index].getID(),
    };

    projects.splice(index, 1);

    pubsub.publish("deleteProjectFromFirebase", projectData);

    // if (_storageAvail) {
    //   _storeProjectsInJSON();
    // }
  };

  const submitNewProject = (dataObject) => {
    const data = dataObject;

    if (!data.id) {
      data.id = uniqid() + uniqid();
    }

    if (!data.timestamp) {
      console.log("no timestamp found, leaving blank");
      data.timestamp = "";
    }

    const project = factory(data.id, data.title, data.timestamp);

    addProject(project);

    const projectData = _formatProjectDataForDB(project);

    // Only add to DB if the project is missing a timestamp
    if (projectData.timestamp === "") {
      console.log("timestamp is blank for: " + projectData.id);
      pubsub.publish("saveProjectToFirebase", projectData);
    }

    pubsub.publish("postSubmitProject");
  };

  //   const updateProjectStorageAvail = (bool) => {
  //     _storageAvail = bool;
  //   };

  // PubSubs

  //   pubsub.subscribe("checkStorage", updateProjectStorageAvail);

  pubsub.subscribe("removeProjectObject", removeProject);

  pubsub.subscribe("submitProject", submitNewProject);

  //   pubsub.subscribe("pageLoad", populateProjectsFromStorage);

  return {
    factory,
    projects,
    addProject,
  };
})();
