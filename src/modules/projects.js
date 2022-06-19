import { pubsub } from "./pubsub";
import { generalFunctions } from "./general";

export const projectFunctions = (() => {

    // Factories

    const factory = ( title) => {

        const data = {
            "title": title,
        }

        return Object.assign(
            {},
            generalFunctions.titleMethods(data)
        )

    }

    
    // Private variables/functions

    let _storageAvail = false;

    const _convertProjectsListForStorage = (array) => {

        const newProjectsArray = [];

        for( let i = 0; i < array.length; i++){

            const object = {
                "title": array[i].getTitle()
            }

            newProjectsArray.push(object);

        }

        return newProjectsArray;

    }


    const _storeProjectsInJSON = () => {

        const storageProjects = _convertProjectsListForStorage(projects);

        const jsonProjects = JSON.stringify(storageProjects);
        
        localStorage.setItem('projectsList', jsonProjects);

    }


    // Public variables/functions
    const projects = [];

    const addProject = (object) => {
        
        projects.push(object);

        const data = {
            object: object,
            array: projects
        }

        pubsub.publish('projectAdded', data );

        if( _storageAvail ){

            _storeProjectsInJSON();

        }

    }


    const populateProjectsFromStorage = () => {

        if( _storageAvail ) {

            if( localStorage.getItem("projectsList") ) {
                const projectsString = localStorage.getItem("projectsList");

                // convert string to valid object
                const parsedProjects = JSON.parse(projectsString);

                for( let i = 0; i < parsedProjects.length; i++ ){

                    const project = factory( 
                        parsedProjects[i].title
                    )

                    addProject(project);

                }

            }

        }

    }


    const removeProject = (index) => {

        projects.splice(index, 1);

        if( _storageAvail ){

            _storeProjectsInJSON();

        }

    }


    const submitNewProject = (dataObject) => {

        const data = dataObject;

        const project = factory( data.title );

        addProject(project);

        pubsub.publish('postSubmitProject');

    }

    const updateProjectStorageAvail = (bool) => {

        _storageAvail = bool;

    }


    // PubSubs

    pubsub.subscribe('checkStorage', updateProjectStorageAvail);

    pubsub.subscribe('removeProjectObject', removeProject);

    pubsub.subscribe('submitProject', submitNewProject);

    pubsub.subscribe('pageLoad', populateProjectsFromStorage);


    return {
        factory,
        projects,
        addProject
    }

})();