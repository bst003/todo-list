// import { generalFunctions } from "./general";

export const taskFunctions = (() => {

    // Factories

    const factory = ( title, description, dueDate, priority) => {

        let status = 'incomplete';

        const getTitle = () => title;
        const getDescription  = () => description;
        const getDueDate  = () => dueDate;
        const getPriority  = () => priority;
        const getStatus = () => status;

        const toggleStatus = () => {
            if( status === 'incomplete'){
                status = 'complete';
            } else {
                status = 'incomplete';
            }
        }

        return{
            getTitle,
            getDescription,
            getDueDate,
            getPriority,
            getStatus,
            toggleStatus
        }

    }


    // Private variables/functions


    // Public variables/functions

    const tasks = [];


    return {
        factory,
        tasks
    }

})();