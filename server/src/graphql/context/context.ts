import { Request } from "express";
import { IDataService } from "../../service/IDataService";
import { IDataLoader } from "../../service/IDataLoader";

export interface GraphQLContext {
  request: Request;
  dataService: IDataService;
  dataLoader: IDataLoader;
}
