import { Service, Inject } from "typedi";
import { Problem, ProblemStatus } from "./model/problem.model";
import { sleep } from "./utils/sleep";
import { Config } from "./config";
import { runOnConjure } from "./conjure-runner";
import { PubSubEngine, PubSub } from "type-graphql";
import { PROBLEMS } from "../resolvers/problem.resolver";

@Service()
export class Scheduler {
  public readonly problemQueue: Problem[] = [];
  private consumed: number = 0;

  constructor(private readonly config: Config,
    private readonly pubSub: PubSubEngine) {
    this.run();
  }

  add(problem: Problem) {
    this.problemQueue.push(problem);
  }

  /**
   * Get stats of all jobs
   */
  private jobStats(): {[P in ProblemStatus]: number} {
    return this.problemQueue.reduce(
      (acc, cur) => {
        acc[cur.status] += 1;
        return acc
      },
      {
        "QUEUED": 0,
        "ACCEPTED": 0,
        "RUNNING": 0,
        "COMPLETED": 0,
        "FAILED": 0
      });
  }

  private async executeProblem(problem: Problem) {
    console.log(`Executing problem (${problem.id})`)

    problem.status = 'RUNNING';

    this.pubSub.publish(PROBLEMS, problem);

    let solutions;

    try {
      solutions = await runOnConjure(problem);
      problem.status = 'COMPLETED';
      problem.solutions = solutions;
    } catch (e) {
      console.log(e);
      problem.status = 'FAILED';
    }

    console.log(`[${problem.id}] Finished with status ${problem.status}`)

    this.pubSub.publish(PROBLEMS, problem);
  }

  private async sendSubscriptionHeartbeat() {
    this.problemQueue.forEach(p => this.pubSub.publish(PROBLEMS, p));
  }

  /**
   * Run this scheduler, consuming jobs constantly
   */
  private async run() {
    while(true) {
      await sleep(1000);

      this.sendSubscriptionHeartbeat();

      console.log(this.jobStats())
      if (this.jobStats().RUNNING >= this.config.parallelSolvers)
      {
        continue;
      }

      if (!this.problemQueue[this.consumed])
        continue;

      const problem = this.problemQueue[this.consumed++];

      if (!problem) {
        continue;
      }

      console.log(`Consuming new problem (${problem.id})`);

      this.executeProblem(problem);

    }
  }
}
