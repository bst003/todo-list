require("../node_modules/rmodal/dist/rmodal.css");

import "./assets/scss/styles.scss";

import "animate.css";

import { compareAsc, format } from "date-fns";

import { generalFunctions } from "./modules/general";
import { domFunctions } from "./modules/domStuff";
import { pubsub } from "./modules/pubsub";
import { taskFunctions } from "./modules/tasks";
import { projectFunctions } from "./modules/projects";
import { firebaseControlsFunctions } from "./modules/firebaseControls";

pubsub.publish("prePageLoad");
pubsub.publish("pageLoad");
