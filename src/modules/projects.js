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


    // Public variables/functions
    const projects = [];

    const addProject = (object) => {
        
        projects.push(object);

        const data = {
            object: object,
            array: projects
        }

        pubsub.publish('projectAdded', data );
    }


    const submitNewProject = (dataObject) => {

        const data = dataObject;

        const project = factory( data.title );

        addProject(project);

        pubsub.publish('postSubmitProject');

    }


    pubsub.subscribe('submitProject', submitNewProject);


    return {
        factory,
        projects,
        addProject
    }

})();