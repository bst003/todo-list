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


    const _clearContent = (parent) => {

        while( parent.firstChild ){

            parent.removeChild( parent.firstChild );

        }

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
        task.setAttribute(`data-index`, index );
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


    const _addSingleTaskListener = (index, className, func) => {

        const button = document.querySelector(`.task-item[data-index="${index}"] .${className}`);

        button.addEventListener('click', func );

    }



    const _addAllTaskListeners = (className, func) => {

        const buttons = document.querySelectorAll(`.task-item .${className}`);

        buttons.forEach( (button) => {

            button.addEventListener('click', func );

        })

    }


    const _removeSingleTaskListener = (index, className, func) => {

        const button = document.querySelector(`.task-item[data-index="${index}"] .${className}`);

        button.removeEventListener('click', func );

    }


    const _toggleTaskElementStatus = (e) => {

        console.log(e);

        const taskIndex = e.target.parentElement.parentElement.getAttribute('data-index');

        pubsub.publish('toggleTaskStatus', taskIndex);

        pubsub.publish('updateTask', taskIndex);

    }


    const _deleteTaskElement = (e) => {

        console.log(e);

        const taskIndex = e.target.parentElement.parentElement.getAttribute('data-index');

        _removeSingleTaskElementListeners(taskIndex);

        _tasksList.removeChild( _tasksList.children[taskIndex] );

        _updateTaskElementIndexes(taskIndex);

        pubsub.publish('removeTask', taskIndex);

    }


    const _editTaskElement = (e) => {

        console.log(e);

        const taskModalHeader = document.querySelector('#add-task-modal .h4 strong');
        _clearContent( taskModalHeader );
        taskModalHeader.innerText = 'Edit Task';

        const taskIndex = e.target.parentElement.parentElement.getAttribute('data-index');

        const taskForm = document.querySelector('#add-task-form');
        taskForm.setAttribute('data-edit-index', taskIndex);

        pubsub.publish('editTask');

    }

    
    const _addSingleTaskElementListeners = (index) => {

        _addSingleTaskListener( index, 'complete', _toggleTaskElementStatus);
        _addSingleTaskListener( index, 'delete', _deleteTaskElement);
        _addSingleTaskListener( index, 'edit', _editTaskElement);

    }


    const _removeSingleTaskElementListeners = (index) => {

        _removeSingleTaskListener( index, 'complete', _toggleTaskElementStatus);
        _removeSingleTaskListener( index, 'delete', _deleteTaskElement);
        _removeSingleTaskListener( index, 'edit', _editTaskElement);

    }


    const _updateTaskElementIndexes = (index) => {

        for( let i = index; i < _tasksList.children.length; i++ ){

            const y = Number(i) + 1;

            const taskElement = document.querySelector(`.task-item[data-index="${y}"]`);

            taskElement.setAttribute('data-index', i);

        }


    }


    const _gatherTaskFormValues = () => {

        const title = document.querySelector('#task-title').value;
        const description = document.querySelector('#task-description').value;
        const date = document.querySelector('#task-due-date').value;
        const priority = document.querySelector('#task-priority').value;
        const project = document.querySelector('#task-project').value;

        const data = {
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

    const renderProject = (data) => {

        console.log(data);

        const project = _createProjectElement( data.object, data.array.length );

        _projectsList.appendChild( project );

    }

    const renderTask = ( data ) => {

        console.log(data);

        if( data.index === undefined ) {
            const task = _createTaskElement( data.object, data.array.length - 1 );

            _tasksList.appendChild( task );
            _addSingleTaskElementListeners( data.array.length - 1 );
            console.log('null index');
        }

        if( data.index !== undefined ){
            const task = _createTaskElement( data.object, data.index );

            _removeSingleTaskElementListeners( data.index );
            
            _tasksList.replaceChild(task, _tasksList.children[data.index] );
            _addSingleTaskElementListeners( data.index );
            console.log( 'index accepted' );
        }

    }


    // const renderTasksList = (array) => {

    //     array.forEach( ( object, index ) => {

    //         const task = _createTaskElement( object, index );

    //         _tasksList.appendChild( task );

    //     });

    // }


    const addTaskFormListener = () =>{

        const form = document.querySelector('#add-task-modal form');

        form.addEventListener('submit', function(e) {
        
            e.preventDefault();

            const data = _gatherTaskFormValues();

            pubsub.publish('submitTask', data );

            _resetTaskFormValues();

        });

    }


    const addTaskElementsListeners = () => {

        _addAllTaskListeners('complete', _toggleTaskElementStatus);
        _addAllTaskListeners('delete', _deleteTaskElement);
        _addAllTaskListeners('edit', _editTaskElement);

    }


    // Takes a modal object defined using the modal factory
    const setUpModal = ( modal ) =>{

        const showModal = document.querySelector( modal.getOpenElement() );
        const closeModal = document.querySelector( modal.getCloseElement() );

        showModal.addEventListener('click', function(e) {
            modal.modalObject.open();
        });

        closeModal.addEventListener('click', function(e) {
            modal.modalObject.close();
        });

    }


    // PubSubs

    pubsub.subscribe('taskAdded', renderTask);

    pubsub.subscribe('projectAdded', renderProject);

    pubsub.subscribe('pageLoad', addTaskFormListener);
    pubsub.subscribe('pageLoad', setUpModal);
    pubsub.subscribe('pageLoad', addTaskElementsListeners);


    return {
    }

})();