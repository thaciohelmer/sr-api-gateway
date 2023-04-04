import { Player } from 'src/players/interfaces/player.interface';

export interface Match {
  category: string;
  def: string;
  result: Array<Result>;
  players: Array<string>;
  challenge?: string;
}

export interface Result {
  set: string;
}
