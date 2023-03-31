import { ChallengeStatus } from './challenge-status.enum';

export interface Challenge {
  status: ChallengeStatus;
  requester: string;
  challengeDate: Date;
  requestDate: Date;
  responseDate: Date;
  category: string;
  players: Array<string>;
  match?: string;
}
