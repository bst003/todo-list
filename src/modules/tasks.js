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

    const _gatherTaskFormValues = () => {

        const title = document.querySelector('#task-title').value;
        const description = document.querySelector('#task-description').value;
        const date = document.querySelector('#task-due-date').value;
        const priority = document.querySelector('#task-priority').value;
        const project = document.querySelector('#task-project').value;

        const data ={
            title,
            description,
            date,
            priority,
            project
        };

        return data;

    }

    const _resetTaskFormValues = () => {

        document.querySelector('#task-title').value = '';
        document.querySelector('#task-description').value = '';
        document.querySelector('#task-due-date').value = '';
        document.querySelector('#task-priority').value = '';
        document.querySelector('#task-project').value = '';

    }


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


    const submitNewTask = (e) => {

        e.preventDefault();

        const data = _gatherTaskFormValues();

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

    pubsub.subscribe('postSubmitTask', _resetTaskFormValues);


    return {
        factory,
        tasks,
        addTask
    }

})();