import { InputType, Field } from "type-graphql";

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
}
