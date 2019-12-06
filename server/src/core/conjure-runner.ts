const util = require('util')
const spawn = util.promisify(require('child_process').spawn)

import * as path from 'path';
import { Problem } from "./model/problem.model";

export interface ConjureStatus {

}

export const WORKING_DIR = 'conjure-output';

export const getJobWorkingDirectory = (id: string) => path.resolve(`./${WORKING_DIR}/${id}`)

/**
 * Write essence and param files for this problem
 *
 * @param job to create files for
 */
export const createConjureEssenceAndParamsFiles = (job: Problem) => {

}

export const constructConjureArgs = (job: Problem) =>
         `solve -ac --output-format=json --copy-solutions=no  --solver=minion --limit-time=90 ${path.join(
           getJobWorkingDirectory(job.id),
           'job.essence'
         )} ${path.join(
           getJobWorkingDirectory(job.id),
           'job.param'
         )} -o ${getJobWorkingDirectory(job.id)}`.split(' ')

/**
 * Begins executing of a problem on conjure
 *
 * @param problem to run
 */
export const runOnConjure = async (job: Problem) => {
  const args = constructConjureArgs(job);

  return spawn('conjure', args, {});
}
