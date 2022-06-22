"use strict";

require("./assets/scss/styles.scss");

require("animate.css");

var _dateFns = require("date-fns");

var _general = require("./modules/general");

var _domStuff = require("./modules/domStuff");

var _pubsub = require("./modules/pubsub");

var _tasks = require("./modules/tasks");

var _projects = require("./modules/projects");

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// require('../node_modules/rmodal/dist/rmodal.css');
require('../node_modules/rmodal/index.js');

// import { RModal  } from '../node_modules/rmodal/index.js';
Promise.resolve().then(function () {
  return _interopRequireWildcard(require('../node_modules/rmodal/index.js'));
}); // const rmodal = require('../node_modules/rmodal/index.js');

var _require = require('../../node_modules/rmodal/index.js'),
    Rmodal = _require.Rmodal;

console.log(Rmodal); // require('../node_modules/rmodal/dist/rmodal.css');
// require('../node_modules/rmodal/dist/rmodal.js');
// import '../node_modules/rmodal/dist/rmodal.css';
// import '../node_modules/rmodal/dist/rmodal.js';

_pubsub.pubsub.publish('prePageLoad');

_pubsub.pubsub.publish('pageLoad'); // window.taskFunctions = taskFunctions;
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