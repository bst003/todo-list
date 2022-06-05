import { pubsub } from "./pubsub";

export const domFunctions = (() => {

    
    // Private variables/functions

    const _tasksList = document.querySelector('#tasks-list');

    const _appendChildren = ( parent, childArray ) => {

        childArray.forEach( child => {

            parent.appendChild( child );

        });

    }

    const _createIconButton = ( array ) => {

        const buttonClasses = array;
        buttonClasses.unshift('icon-button');

        const button = document.createElement('button');
        
        buttonClasses.forEach( buttonClass => {
            button.classList.add(buttonClass);
        });

        return button;

    }

    const _createTaskElement = ( object, index ) => {

        const task = document.createElement('div');
        task.setAttribute(`data-index`, index);
        task.classList.add(`task-item`, `status-${object.getStatus()}`);

        const priority = document.createElement('div');
        priority.classList.add(`priority`, `${object.getPriority()}`);


        const main = _createTaskElementMain(object);
        // main.classList.add(`main`);

        // const title = document.createElement('p');
        // title.classList.add('task-title');
        // title.innerText = object.getTitle();

        // const description = document.createElement('p');
        // description.innerText = object.getDescription();

        // _appendChildren( main, [title, description] );


        const project = document.createElement('div');
        project.classList.add('project');
        project.innerText = object.getProject();


        const date = document.createElement('div');
        date.classList.add('date');
        date.innerText = object.getDueDate();


        const controls = document.createElement('div');
        controls.classList.add('controls');

        const buttonComplete = _createIconButton(['complete']);
        const buttonEdit = _createIconButton(['edit']);
        const buttonDelete = _createIconButton(['delete', 'reverse']);

        _appendChildren( controls, [buttonComplete, buttonEdit, buttonDelete] );

        _appendChildren( task, [priority, main, project, date, controls] );

        return task;

    }

    const _createTaskElementMain = ( object ) => {

        const appendElements = [];

        const main = document.createElement('div');
        main.classList.add(`main`);

        const title = document.createElement('p');
        title.classList.add('task-title');
        title.innerText = object.getTitle();

        appendElements.push(title);

        if( object.getDescription() !== '' ){

            const description = document.createElement('p');
            description.innerText = object.getDescription();

            appendElements.push(description);

        }

        _appendChildren( main, appendElements );

        return main;

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