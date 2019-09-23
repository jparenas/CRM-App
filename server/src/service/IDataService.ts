import { ContactsService } from "./contacts/ContactsService";
import { ProjectsService } from "./projects/ProjectsService";
import { StagesService } from "./stages/StagesService";

export interface IDataService {
  readonly contactsService: ContactsService;
  readonly projectsService: ProjectsService;
  readonly stageService: StagesService;
}
