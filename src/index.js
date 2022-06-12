import './assets/scss/styles.scss';

import 'animate.css';

import { compareAsc, format } from 'date-fns'


/*

General notes
    Use object assign for general functions like deleting item (project or todo)?
    How to implement pub/sub pattern
    Filter array method for clicking on projects to sort?
    Add default category on load?
    Where should the array of tasks be stored?
    Where should the arrray of projects be stored?
    HOW TO TELL WHAT CATEGORY A TASK IS IN?
    Update #title on project change


Modules Needed
    Dom Stuff
    ToDos/Tasks
    Project/Category
    General Shared Functions
    PubSub


Todos (Tasks)
    Data
        title
        description
        dueData
        priority
        status
    Able to mark complete
    Able to delete
    Able to edit
    

Projects
    Data
        title
    Default project that all todos are in
    Able to delete
    Able to edit
    

*/

import { generalFunctions } from "./modules/general";
import { domFunctions } from "./modules/domStuff";
import { pubsub } from "./modules/pubsub";
import { taskFunctions } from "./modules/tasks";
import { projectFunctions } from "./modules/projects";




window.taskFunctions = taskFunctions;
window.projectFunctions = projectFunctions;


const testTask = window.taskFunctions.factory('title here', 'description here', '02/12/2099', 'high', 'Default');
window.taskFunctions.addTask( testTask );

const testTask2 = window.taskFunctions.factory('task 2', '', '12/06/1994', 'medium', 'Default');
window.taskFunctions.addTask( testTask2 );

const testProject = window.projectFunctions.factory('Test Project');
window.projectFunctions.addProject( testProject );

// generalFunctions.taskModal.open();

// window.taskFunctions.tasks[0].toggleStatus();
// window.taskFunctions.tasks[0].getStatus();


pubsub.publish('pageLoad', generalFunctions.taskModal );


/*

REWORK/CLEAN UP AT LATER TIME

*/


    // var modal = new RModal(document.getElementById('add-task-modal'), {
    //     dialogOpenClass: 'animate__fadeInDown',
    //     dialogCloseClass: 'animate__fadeOutUp'
    // });

    /* DONT ADD BACK
    document.addEventListener('keydown', function(ev) {
        modal.keydown(ev);
    }, false);
    */

    // document.getElementById('showModal').addEventListener("click", function(ev) {
    //     ev.preventDefault();
    //     modal.open();
    // }, false);

    // window.modal = modal;

    // const closeTaskModal = () => {
    //     modal.close()
    // }

    // pubsub.subscribe('postSubmitTask', closeTaskModal );
