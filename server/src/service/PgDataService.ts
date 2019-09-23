import { injectable } from "inversify";
import { IDataService } from "./IDataService";
import { ContactsService } from "./contacts/ContactsService";
import { ProjectsService } from "./projects/ProjectsService";
import { StagesService } from "./stages/StagesService";

@injectable()
export class PgDataService implements IDataService {
  private _contactsService: ContactsService;
  private _projectsService: ProjectsService;
  private _stageService: StagesService;

  constructor(
    contactsService: ContactsService,
    projectsService: ProjectsService,
    stageService: StagesService
  ) {
    this._contactsService = contactsService;
    this._projectsService = projectsService;
    this._stageService = stageService;
  }

  get contactsService() {
    return this._contactsService;
  }

  get projectsService() {
    return this._projectsService;
  }

  get stageService() {
    return this._stageService;
  }
}
