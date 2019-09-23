import { SpecificDataRequest } from "../graphql/types/common";
import { IDataLoader } from "./IDataLoader";
import { injectable } from "inversify";
import DataLoader from "dataloader";
import { ContactsService } from "./contacts/ContactsService";
import { ProjectsService } from "./projects/ProjectsService";
import { StagesService } from "./stages/StagesService";
import { Contact } from "@c/types/contact";
import { Project } from "@c/types/project";
import { Stage } from "@c/types/stage";

@injectable()
export class ServiceDataLoader implements IDataLoader {
  private _contactDataLoader: DataLoader<
    SpecificDataRequest,
    Contact | undefined
  >;
  private _projectDataLoader: DataLoader<
    SpecificDataRequest,
    Project | undefined
  >;
  private _stageDataLoader: DataLoader<SpecificDataRequest, Stage | undefined>;

  constructor(
    contactsService: ContactsService,
    projectsService: ProjectsService,
    stagesService: StagesService
  ) {
    this._contactDataLoader = new DataLoader<
      SpecificDataRequest,
      Contact | undefined
    >(contactsService.contacts);
    this._projectDataLoader = new DataLoader<
      SpecificDataRequest,
      Project | undefined
    >(projectsService.project);
    this._stageDataLoader = new DataLoader<
      SpecificDataRequest,
      Stage | undefined
    >(stagesService.stage);
  }

  contact(request: SpecificDataRequest): Promise<Contact | undefined> {
    return this._contactDataLoader.load(request);
  }

  project(request: SpecificDataRequest): Promise<Project | undefined> {
    return this._projectDataLoader.load(request);
  }

  stage(request: SpecificDataRequest): Promise<Stage | undefined> {
    return this._stageDataLoader.load(request);
  }
}
