/**
 * Internal problem model
 */
export class Problem {
  id: string;

  essence: Buffer;

  params: Buffer;

  status: ProblemStatus;
}

export type ProblemStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED'
