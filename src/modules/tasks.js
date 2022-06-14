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

        const getDescription  = () => data.description ? data.description : "";
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

        const data = {
            object: object,
            array: tasks
        }

        pubsub.publish('taskAdded', data );
    }


    const removeTask = (index) => {

        tasks.splice(index, 1);

    }


    const submitNewTask = (dataObject) => {

        const data = dataObject;

        const task = factory( data.title, data.description, data.date, data.priority, data.project );

        addTask(task);

        pubsub.publish('postSubmitTask');

    }


    const updateTask = (index) => {

        console.log(`index is ${index}`);
        
        const object = tasks[index];

        const data = {
            object: object,
            array: tasks,
            index: index,
        }

        pubsub.publish('taskAdded', data );
    }


    const toggleTaskStatus = (index) => {

        tasks[index].toggleStatus();

    }


    // PubSubs

    pubsub.subscribe('removeTask', removeTask);

    pubsub.subscribe('updateTask', updateTask);

    pubsub.subscribe('toggleTaskStatus', toggleTaskStatus );

    pubsub.subscribe('submitTask', submitNewTask);


    return {
        factory,
        tasks,
        addTask
    }

})();