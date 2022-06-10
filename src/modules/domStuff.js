import { pubsub } from "./pubsub";

export const domFunctions = (() => {

    
    // Private variables/functions

    const _tasksList = document.querySelector('#tasks-list');
    const _projectsList = document.querySelector('#projects-list');

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


    const _createProjectElement = ( object, index ) => {

        const project = document.createElement('button');
        project.setAttribute(`data-index`, index);
        project.innerText = object.getTitle();

        return project;

    }


    const _createTaskElement = ( object, index ) => {

        const task = document.createElement('div');
        task.setAttribute(`data-index`, index);
        task.classList.add(`task-item`, `status-${object.getStatus()}`);

        const priority = document.createElement('div');
        priority.classList.add(`priority`, `${object.getPriority()}`);


        const main = _createTaskElementMain(object);


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
        title.classList.add('title');
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

    const renderProject = (data) => {

        console.log(data);

        const project = _createProjectElement( data.object, data.array.length );

        _projectsList.appendChild( project );

    }

    const renderTask = (data) => {

        console.log(data);

        const task = _createTaskElement( data.object, data.array.length );

        _tasksList.appendChild( task );

    }


    const renderTasksList = (array) => {

        array.forEach( ( object, index ) => {

            const task = _createTaskElement( object, index );

            _tasksList.appendChild( task );

        });

    }


    const setUpTaskFormListener = () =>{

        const form = document.querySelector('#add-task-modal form');

        form.addEventListener('submit', function(e) {
            pubsub.publish('submitTask', e );
        });

    }


    const setUpTaskModal = ( modalObject ) =>{

        const showModal = document.querySelector('#show-task-modal');
        const closeModal = document.querySelector('#add-task-modal .close');

        showModal.addEventListener('click', function(e) {
            modalObject.open();
        });

        closeModal.addEventListener('click', function(e) {
            modalObject.close();
        });

    }


    // PubSubs

    pubsub.subscribe('taskAdded', renderTask);

    pubsub.subscribe('projectAdded', renderProject);

    pubsub.subscribe('pageLoad', setUpTaskFormListener);
    pubsub.subscribe('pageLoad', setUpTaskModal);


    return {
    }

})();