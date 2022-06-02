// import { generalFunctions } from "./general";

export const taskFunctions = (() => {

    // Factories

    const factory = ( title, description, dueDate, priority) => {

        const getTitle = () => title;
        const getDescription  = () => description;
        const getDueDate  = () => dueDate;
        const getPriority  = () => priority;


        return{
            getTitle,
            getDescription,
            getDueDate,
            getPriority
        }

    }


    // Private variables/functions


    // Public variables/functions

    const taskList = [];




    return {
        
    }

})();