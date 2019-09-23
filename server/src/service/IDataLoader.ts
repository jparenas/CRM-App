import { SpecificDataRequest } from "../graphql/types/common";
import { Contact } from "@c/types/contact";
import { Project } from "@c/types/project";

export interface IDataLoader {
  contact(request: SpecificDataRequest): Promise<Contact | undefined>;
  project(request: SpecificDataRequest): Promise<Project | undefined>;
  stage(request: SpecificDataRequest): Promise<Object | undefined>;
}
