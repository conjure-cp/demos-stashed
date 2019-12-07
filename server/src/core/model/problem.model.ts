import { ConjureResponse } from "./solvers/conjure.solution";

/**
 * Internal problem model
 */
export class Problem {
  id: string;

  essence: Buffer;

  params: Buffer;

  solutions: ConjureResponse[];

  status: ProblemStatus;
}

export type ProblemStatus = 'QUEUED' | 'ACCEPTED' | 'RUNNING' | 'COMPLETED' | 'FAILED'
