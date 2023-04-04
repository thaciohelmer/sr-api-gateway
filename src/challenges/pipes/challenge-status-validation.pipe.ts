import { BadRequestException, PipeTransform } from "@nestjs/common";
import { ChallengeStatus } from "../interfaces/challenge-status.enum";

export class ChallengeStatusValidation implements PipeTransform {
  readonly allowedStatus = [
    ChallengeStatus.ACCEPTED,
    ChallengeStatus.DENIED,
    ChallengeStatus.CANCELED,
  ]

  private isValidStatus(status: string): boolean {
    const index = Object.values(this.allowedStatus).find(st => st === status)
    return !!index
  }

  transform(value: any) {
    const status = value.status.toUpperCase()

    if (!this.isValidStatus(status)) {
      throw new BadRequestException(`${status} is an invalid status`)
    }

    return value
  }
}