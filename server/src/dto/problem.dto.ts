import { ObjectType, Field, ID } from "type-graphql";
import { Transform } from "class-transformer";
import uuid = require("uuid");
import { ProblemStatus } from "../core/model/problem.model";

@ObjectType()
export class ProblemDto {
  @Field((type) => ID)
  id: string = uuid.v4();

  @Field(type => String)
  status: ProblemStatus;
}
