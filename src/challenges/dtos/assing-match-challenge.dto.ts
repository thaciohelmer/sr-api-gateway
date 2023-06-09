import { IsNotEmpty } from "class-validator";
import { Result } from "../interfaces/match.interface";
import { Player } from "src/players/interfaces/player.interface";


export class AssingMatchChallengeDto {
  @IsNotEmpty()
  def: string

  @IsNotEmpty()
  result: Array<Result>
}