import { InputType, Field } from "type-graphql";
import { SolverType } from "../core/model/solvers/solvers.type";

@InputType()
export class ProblemInput {
  /**
   * The essence code for solving this problem, encoded in base64.
   */
  @Field()
  essence: string;

  /**
   * The params for solving this problem, encoded in base64.
   */
  @Field()
  params: string;

  @Field({ nullable: true })
  solver?: SolverType;
}
