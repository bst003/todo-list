import { pubsub } from "./pubsub";
import { generalFunctions } from "./general";

export const taskFunctions = (() => {

    // Factories

    const factory = ( title, description, dueDate, priority) => {

        const data = {
            "title": title,
            "description": description,
            "dueDate": dueDate,
            "priority": priority,
            "status": 'incomplete'
        }

        // const getTitle = () => data.title;

        const getDescription  = () => data.description;
        const getDueDate  = () => data.dueDate;
        const getPriority  = () => data.priority;
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
            getStatus,
            toggleStatus
        }

        return Object.assign(
            {},
            generalFunctions.titleMethods(data),
            baseMethods
        )

        // return{
        //     getTitle,
        //     getDescription,
        //     getDueDate,
        //     getPriority,
        //     getStatus,
        //     toggleStatus
        // }

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