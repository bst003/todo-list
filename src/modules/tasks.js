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
        const setDescription = (value) => data.description = value;

        const getDueDate  = () => data.dueDate ? data.dueDate : 'no date';
        const setDueDate = (value) => data.dueDate = value;

        const getPriority  = () => data.priority ? data.priority : 'low';
        const setPriority = (value) => data.priority = value;

        const getProject  = () => data.project ? data.project : 'Default';
        const setProject = (value) => data.project = value;

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
            setDescription,
            getDueDate,
            setDueDate,
            getPriority,
            setPriority,
            getProject,
            setProject,
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


    const getTaskData = (index) => {

        const data = tasks[index];
        
        pubsub.publish('editTaskPopulateForm', data);

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


    const updateTaskValues = (editData) => {

        console.log(editData);

        const task = tasks[editData.index];

        const values = editData.object;

        task.setTitle(values.title);
        task.setDescription(values.description);
        task.setDueDate(values.date);
        task.setPriority(values.priority);
        task.setProject(values.project);

        const data = {
            object: task,
            array: tasks,
            index: editData.index,
        }

        pubsub.publish('taskAdded', data );

    }


    const toggleTaskStatus = (index) => {

        tasks[index].toggleStatus();

    }


    // PubSubs

    pubsub.subscribe('getTask', getTaskData);

    pubsub.subscribe('removeTask', removeTask);

    pubsub.subscribe('updateTask', updateTask);

    pubsub.subscribe('toggleTaskStatus', toggleTaskStatus );

    pubsub.subscribe('submitTask', submitNewTask);

    pubsub.subscribe('submitEditedTask', updateTaskValues);


    return {
        factory,
        tasks,
        addTask
    }

})();