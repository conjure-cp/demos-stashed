/**
 * Internal problem model
 */
export class Problem {
  id: string;

  essence: ArrayBuffer;

  params: ArrayBuffer;

  status: ProblemStatus;
}

export type ProblemStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED'
