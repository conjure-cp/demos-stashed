import { Service } from "typedi";

@Service()
export class Config {
  parallelSolvers: number = 10;
}
