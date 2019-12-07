import { ObjectType, Field, ID } from "type-graphql";
import { Transform, Exclude, Expose } from "class-transformer";
import { ProblemStatus } from "../core/model/problem.model";
import GraphQLJSON from "graphql-type-json";
import { ConjureResponse } from "../core/model/solvers/conjure.solution";


@ObjectType()
@Exclude()
export class ProblemDto {
  @Field((type) => ID)
  @Expose()
  id: string;

  @Field(type => String)
  @Expose()
  status: ProblemStatus;

  @Field(type => GraphQLJSON)
  solutions: ConjureResponse[];
}
