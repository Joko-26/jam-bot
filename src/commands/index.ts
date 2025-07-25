import * as theme from "./theme";
import * as timeleft from "./timeleft";
import * as jam from "./jam";
import * as createjam from "./create-jam";
import * as addtheme from "./addtheme";
import * as deletejam from "./killjam";
import * as announcewinner from "./winner";
import * as setup from "./setup";
import * as deletetheme from "./deletetheme";
import * as help from "./help";

// this is a index for all commads that the deploy-commads and the comand listener script uses, new commands have to be added in the same manner.
export const commands = {
  theme,
  timeleft,
  jam,
  createjam,
  addtheme,
  deletejam,
  announcewinner,
  setup,
  deletetheme,
  help,
};
