import { ProblemDto } from "../dto/problem.dto";
import { Service } from "typedi";
import { Problem } from "../core/model/problem.model";
import { ProblemInput } from "../inputs/problem.input";
import uuid = require("uuid");
import { Scheduler } from "../core/scheduler";

/**
 * Service class to manage
 */
@Service()
export class ProblemService {

  constructor(private scheduler: Scheduler) {}

  async addProblem(problem: ProblemInput) {
    // Construct a problem from this dto

    const internalProblem = new Problem();
    internalProblem.essence = Buffer.from(problem.essence, 'base64');
    internalProblem.params = Buffer.from(problem.params, 'base64');
    internalProblem.id = uuid.v4();

    this.scheduler.add(internalProblem);
  }

  async findById(id: string): Promise<ProblemDto> {
    return this.scheduler.problemQueue.find(p => p.id === id);
  }
}
