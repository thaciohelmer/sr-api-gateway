import { BadRequestException, PipeTransform } from "@nestjs/common";
import { ChallengeStatus } from "../interfaces/challenge-status.enum";

export class ChallengeStatusValidation implements PipeTransform {
  readonly allowedStatus = [
    ChallengeStatus.ACCEPTED,
    ChallengeStatus.DENIED,
    ChallengeStatus.CANCELED,
  ]

  private isValidStatus(status: string): boolean {
    const index = Object.keys(this.allowedStatus).indexOf(status)
    return index !== -1
  }

  transform(value: any) {
    const status = value.status.toUpperCase()

    if (!this.isValidStatus(status)) {
      throw new BadRequestException(`${status} is an invalid status`)
    }

    return value
  }
}