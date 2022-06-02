// import { generalFunctions } from "./general";

export const taskFunctions = (() => {

    // Factories

    const factory = ( title, description, dueDate, priority) => {

        const getTitle = () => title;
        const getDescription  = () => description;
        const getDueDate  = () => dueDate;
        const getPriority  = () => priority;
        const getStatus = () => 'uncomplete';


        return{
            getTitle,
            getDescription,
            getDueDate,
            getPriority,
            getStatus
        }

    }


    // Private variables/functions


    // Public variables/functions

    const taskList = [];

    const addTask = ( array ) => {
        1
    }


    return {
        factory,
        taskList
    }

})();