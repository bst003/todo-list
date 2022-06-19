import './assets/scss/styles.scss';

import 'animate.css';

import { compareAsc, format } from 'date-fns';

import { generalFunctions } from "./modules/general";
import { domFunctions } from "./modules/domStuff";
import { pubsub } from "./modules/pubsub";
import { taskFunctions } from "./modules/tasks";
import { projectFunctions } from "./modules/projects";


pubsub.publish('prePageLoad');
pubsub.publish('pageLoad');


// window.taskFunctions = taskFunctions;
// window.projectFunctions = projectFunctions;


// const testTask = window.taskFunctions.factory('title here', 'description here', '02-12-2099', 'high', 'Default');
// window.taskFunctions.addTask( testTask );

// const testTask2 = window.taskFunctions.factory('task 2', '', '12-06-1994', 'medium', 'Default');
// window.taskFunctions.addTask( testTask2 );

// const testTask3 = window.taskFunctions.factory('task 3', 'this is a test', '11-06-1994', 'low', 'Fitness');
// window.taskFunctions.addTask( testTask3 );

// const testProject = window.projectFunctions.factory('Default');
// window.projectFunctions.addProject( testProject );

// const testProject2 = window.projectFunctions.factory('Fitness');
// window.projectFunctions.addProject( testProject2 );

// generalFunctions.taskModal.open();

// window.projectFunctions.projects

// window.taskFunctions.tasks[0].toggleStatus();
// window.taskFunctions.tasks[0].getStatus();
// window.taskFunctions.tasks[0].getTitle();
// window.taskFunctions.tasks[0].getDueDate();
