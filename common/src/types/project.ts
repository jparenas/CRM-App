import { Row } from "./common";
import { Contact } from "./contact";
import { Stage } from "./stage";

export interface Project extends Row {
  name?: string;
  stage?: Stage;
  contact?: Contact;
  created_at?: Date;
  updated_at?: Date;
}
