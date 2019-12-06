import { ObjectType, Field, ID } from "type-graphql";
import { Transform, Exclude, Expose } from "class-transformer";
import { ProblemStatus } from "../core/model/problem.model";

@ObjectType()
@Exclude()
export class ProblemDto {
  @Field((type) => ID)
  @Expose()
  id: string;

  @Field(type => String)
  @Expose()
  status: ProblemStatus;


}
