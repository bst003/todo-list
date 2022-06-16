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

const testTask3 = window.taskFunctions.factory('task 3', 'this is a test', '11/06/1994', 'low', 'Default');
window.taskFunctions.addTask( testTask2 );

const testProject = window.projectFunctions.factory('Default');
window.projectFunctions.addProject( testProject );

const testProject2 = window.projectFunctions.factory('Fitness');
window.projectFunctions.addProject( testProject2 );

// generalFunctions.taskModal.open();

// window.taskFunctions.tasks[0].toggleStatus();
// window.taskFunctions.tasks[0].getStatus();
// window.taskFunctions.tasks[0].getTitle();
// window.taskFunctions.tasks[0].getDueDate();


// pubsub.publish('pageLoad', generalFunctions.taskModal );
pubsub.publish('pageLoad');


/*

CREATE FUNCTION TO REMOVE LISTENERS TO NEWLY ADDED TASK ITEMS
    Will need to run on following:
        Task added
        Task Completed
        Task edited

CREATE FUNCTION TO ADD LISTENERS TO NEWLY ADDED TASK ITEMS
    Will need to run on following:
        Task added
        Task Completed
        Task edited

*/