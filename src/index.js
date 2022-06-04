import './assets/scss/styles.scss';

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

const anotherTest = (name) => {
    console.log(`test: ${name}`);
}

pubsub.subscribe('taskAdded', anotherTest);

pubsub.publish('testSub', 'Bill');



// window.pubsub = pubsub;
window.taskFunctions = taskFunctions;


const testTask = window.taskFunctions.factory('title here', 'description here', '02/12/2099', 'high');
window.taskFunctions.addTask( testTask );

// window.taskFunctions.tasks[0].getTitle()