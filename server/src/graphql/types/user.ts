import { Row } from "@c/types/common";

export interface User extends Row {
  password?: string;
  first_name?: string;
  last_name?: string;
  email: string;
}

export interface UserSession {
  first_name?: string;
  last_name?: string;
  email: string;
  admin?: boolean;
}
