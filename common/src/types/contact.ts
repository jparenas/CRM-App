import { Row } from "./common";

export interface Contact extends Row {
  first_name?: string;
  last_name?: string;
  full_name?: string;
  email?: string;
  created_at?: Date;
  updated_at?: Date;
}
