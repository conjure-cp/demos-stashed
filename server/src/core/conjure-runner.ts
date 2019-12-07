import * as fs from 'fs'
import * as path from 'path'
import { Problem, ProblemStatus } from './model/problem.model'
import { promiseSpawn } from './utils/await-exec'
import { ConjureResponse } from './model/solvers/conjure.solution'

export interface ConjureStatus {}

export const WORKING_DIR = 'solutions'

export const getJobWorkingDirectory = (id: string) => `/app/${WORKING_DIR}/${id}`

/**
 * Write essence and param files for this problem
 *
 * @param job to create files for
 */
export const createConjureEssenceAndParamsFiles = (job: Problem) => {}

export const constructConjureArgs = (job: Problem) =>
         `solve -ac --copy-solutions=no --solver=minion --output-format=json --limit-time=90 ${path.join(
           getJobWorkingDirectory(job.id),
           'job.essence'
         )} ${path.join(
           getJobWorkingDirectory(job.id),
           'job.param'
         )} -o ${path.join(
           getJobWorkingDirectory(job.id), 'solutions')}`.split(' ')

/**
 * Begins executing of a problem on conjure
 *
 * @param problem to run
 */
export const runOnConjure = async (job: Problem): Promise<ConjureResponse[]> => {
  const args = constructConjureArgs(job)
  const dir = getJobWorkingDirectory(job.id)

  fs.mkdirSync(path.resolve(dir), { recursive: true })
  fs.writeFileSync(path.join(dir, `job.essence`), job.essence)
  fs.writeFileSync(path.join(dir, `job.param`), job.params)

  let result;

  try {
   result = await promiseSpawn('conjure', args, { encoding: 'utf-8' })
 } catch (e) {
   console.log(e)
   throw e;
 }

  /*
    Check output
  */
 const solutionDir = path.join(dir, 'solutions');

   const solutions: ConjureResponse[] = fs
     .readdirSync(solutionDir)
     .filter((f) => f.match(/.*\.(json)/gi))
     .map(f => JSON.parse(fs.readFileSync(path.join(solutionDir, f)).toString('utf-8')));

     /*
      For now, handle single JSON output.
      TODO: Consider multiple json case
     */

  return solutions;
}
