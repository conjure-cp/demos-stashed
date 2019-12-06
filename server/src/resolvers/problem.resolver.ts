import {
  Resolver,
  Query,
  FieldResolver,
  Arg,
  Root,
  Mutation,
  Float,
  Int,
  ResolverInterface,
  PubSub,
  PubSubEngine,
  Subscription,
  ResolverFilterData,
  Args,
} from 'type-graphql';
import { plainToClass } from 'class-transformer';
import { Service, Inject } from 'typedi';
import uuid from 'uuid';

import { ProblemDto } from '../dto/problem.dto';
import { ProblemInput } from '../inputs/problem.input';
import { ProblemService } from '../service/problem.service';

/**
 * Main problem topic
 */
export const PROBLEMS = 'PROBLEMS';

@Service()
@Resolver((of) => ProblemDto)
export class ProblemResolver {

  constructor(private readonly problemService: ProblemService,
            @Inject('PUB_SUB') private readonly pubSub: PubSubEngine) {}

  @Query(returns => ProblemDto)
  async Problem(@Arg('id') id: string): Promise<ProblemDto> {
    return await this.problemService.findById(id);
  }

  @Mutation(returns => ProblemDto)
  async addProblem(
    @Arg('problem') problem: ProblemInput
  ): Promise<ProblemDto> {
    const payload = plainToClass(ProblemDto, problem);

    await this.problemService.addProblem(problem);
    await this.pubSub.publish(PROBLEMS, payload)
    return payload;
  }

  @Subscription(returns => ProblemDto, {
    topics: PROBLEMS,
    filter: ({ args, payload }: ResolverFilterData<ProblemDto>) =>
      payload.id === args.id,
    nullable: true,
  })
  subscribeProblems(@Arg('id') id: string, @Root() problem: ProblemDto) {
    return problem;
  }
}
