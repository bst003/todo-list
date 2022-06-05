import { pubsub } from "./pubsub";
import { generalFunctions } from "./general";

export const taskFunctions = (() => {

    // Factories

    const factory = ( title, description, dueDate, priority, project) => {

        const data = {
            "title": title,
            "description": description,
            "dueDate": dueDate,
            "priority": priority,
            "project": project,
            "status": 'incomplete'
        }

        const getDescription  = () => data.description;
        const getDueDate  = () => data.dueDate ? data.dueDate : 'no date';
        const getPriority  = () => data.priority ? data.priority : 'low';
        const getProject  = () => data.project ? data.project : 'Default';
        const getStatus = () => data.status;

        const toggleStatus = () => {
            if( data.status === 'incomplete'){
                data.status = 'complete';
            } else {
                data.status = 'incomplete';
            }
        }

        const baseMethods = {
            getDescription,
            getDueDate,
            getPriority,
            getProject,
            getStatus,
            toggleStatus
        }

        return Object.assign(
            {},
            generalFunctions.titleMethods(data),
            baseMethods
        )

    }


    // Private variables/functions


    // Public variables/functions

    const tasks = [];

    const addTask = (object) => {
        tasks.push(object);
        console.table(tasks);
        pubsub.publish('taskAdded', tasks);
        console.log('hello world');
    }


    return {
        factory,
        tasks,
        addTask
    }

})();