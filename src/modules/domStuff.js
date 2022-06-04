import { pubsub } from "./pubsub";

export const domFunctions = (() => {

    
    // Private variables/functions

    const _tasksList = document.querySelector('#tasks-list');

    const _createTaskElement = ( object, index ) => {

        const task = document.createElement('div');
        task.setAttribute(`data-index`, index);
        task.classList.add(`task-item`, `status-${object.getStatus()}`);

        return task;

    }


    // Public variables/functions

    const renderTasks = (array) => {

        array.forEach( ( object, index ) => {

            const task = _createTaskElement( object, index );

            _tasksList.appendChild( task );

        });

    }


    // PubSubs

    pubsub.subscribe('taskAdded', renderTasks);


    return {
    }

})();