import './assets/scss/styles.scss';
import './assets/css/modal.css';
import '../node_modules/rmodal/dist/rmodal.js';
import '../node_modules/rmodal/dist/rmodal.css';
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




// window.pubsub = pubsub;
window.taskFunctions = taskFunctions;


const testTask = window.taskFunctions.factory('title here', 'description here', '02/12/2099', 'high', 'Default');
window.taskFunctions.addTask( testTask );

const testTask2 = window.taskFunctions.factory('task 2', '', '12/06/1994', 'medium', 'Default');
window.taskFunctions.addTask( testTask2 );


window.onload = function() {
    var modal = new RModal(document.getElementById('modal'), {
        //content: 'Abracadabra'
        beforeOpen: function(next) {
            console.log('beforeOpen');
            next();
        },
        afterOpen: function() {
            console.log('opened');
        },
        beforeClose: function(next) {
            console.log('beforeClose');
            next();
        },
        afterClose: function() {
            console.log('closed');
        },
        dialogOpenClass: 'animate__slideInDown',
        dialogCloseClass: 'animate__slideOutUp'
        // bodyClass: 'modal-open',
        // dialogClass: 'modal-dialog',

        // focus: true,
        // focusElements: ['input.form-control', 'textarea', 'button.btn-primary'],

        // escapeClose: true
    });

    document.addEventListener('keydown', function(ev) {
        modal.keydown(ev);
    }, false);

    document.getElementById('showModal').addEventListener("click", function(ev) {
        ev.preventDefault();
        modal.open();
    }, false);

    window.modal = modal;
}