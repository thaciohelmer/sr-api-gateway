import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { lastValueFrom } from 'rxjs';
import { Player } from 'src/players/interfaces/player.interface';
import { ChallengeStatusValidation } from './pipes/challenge-status-validation.pipe';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { Challenge } from './interfaces/challenge.interface';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { AssingMatchChallengeDto } from './dtos/assing-match-challenge.dto';
import { Match } from './interfaces/match.interface';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private clientProxy: ClientProxySmartRanking) {}

  private clientChallenges = this.clientProxy.getChallenge();
  private clientAdmBackend = this.clientProxy.getAdmBackend();

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(@Body() createChallengeDto: CreateChallengeDto) {
    const { players } = createChallengeDto;

    const playerOne = await lastValueFrom(
      this.clientAdmBackend.send('get-player-by-id', players[0]),
    );
    const playerTwo = await lastValueFrom(
      this.clientAdmBackend.send('get-player-by-id', players[1]),
    );

    if (!playerOne) {
      throw new BadRequestException(
        `Player One - No player found with that id: ${playerOne[0]}`,
      );
    }

    if (!playerTwo) {
      throw new BadRequestException(
        `Player Two - No player found with that id: ${playerTwo[1]}`,
      );
    }

    const requesterIsMatchPlayer = createChallengeDto.players.find(
      (player) => player == createChallengeDto.requester,
    );

    if (!requesterIsMatchPlayer) {
      throw new BadRequestException('Requester must be a player in the match!');
    }

    const category = await lastValueFrom(
      this.clientAdmBackend.send(
        'get-category-by-name',
        createChallengeDto.category,
      ),
    );

    if (!category) {
      throw new BadRequestException('Reported category does not exist');
    }

    await this.clientChallenges.emit('create-challenge', createChallengeDto);
  }

  @Get('/player/:id')
  async getChallengeByPlayer(@Param('id') id: string): Promise<any> {
    if (id) {
      const player: Player = await lastValueFrom(
        this.clientAdmBackend.send('get-player-by-id', id),
      );
      if (!player) {
        throw new BadRequestException('Player not found');
      }
    }
    return await lastValueFrom(this.clientChallenges.send('get-by-player', id));
  }

  @Get('/:id')
  async getChallengeById(@Param('id') id: string): Promise<any> {
    return await lastValueFrom(this.clientChallenges.send('get-by-id', id));
  }

  @Put('/:challenge')
  async updateChallenge(
    @Body(ChallengeStatusValidation) updateChallengeDto: UpdateChallengeDto,
    @Param('challenge') id: string,
  ) {
    const challenge: Challenge = await lastValueFrom(
      this.clientChallenges.send('get-by-id', id),
    );

    if (!challenge) {
      throw new BadRequestException(`Challenge not found`);
    }

    if (challenge.status != ChallengeStatus.PENDING) {
      throw new BadRequestException(
        'Only challenges with PENDING status can be updated',
      );
    }

    await lastValueFrom(
      this.clientChallenges.emit('update-challenge', {
        id: id,
        challenge: updateChallengeDto,
      }),
    );
  }

  @Post('/:challenge/match/')
  async assingMatchChallenge(
    @Body(ValidationPipe) assignMatchChallengeDto: AssingMatchChallengeDto,
    @Param('challenge') id: string,
  ) {
    const challenge: Challenge = await lastValueFrom(
      this.clientChallenges.send('get-by-id', id),
    );

    console.log('challenge', challenge);

    if (!challenge) {
      throw new BadRequestException('Challenge not found');
    }

    if (challenge.status == ChallengeStatus.REALIZED) {
      throw new BadRequestException('Challenge already done');
    }

    if (challenge.status != ChallengeStatus.ACCEPTED) {
      throw new BadRequestException(
        'Matches can only be launched in challenges accepted by opponents',
      );
    }

    if (!challenge.players.includes(assignMatchChallengeDto.def)) {
      throw new BadRequestException(
        'The winning player of the match must be part of the challenge',
      );
    }
    const match: Match = {
      category: challenge.category,
      def: assignMatchChallengeDto.def,
      challenge: id,
      players: challenge.players,
      result: assignMatchChallengeDto.result,
    };

    await lastValueFrom(this.clientChallenges.emit('create-match', match));
  }

  @Delete('/:id')
  async deleteChallenge(@Param('id') id: string) {
    const challenge: Challenge = await lastValueFrom(
      this.clientChallenges.send('get-challenges', { playerId: '', id: id }),
    );

    if (!challenge) {
      throw new BadRequestException(`Challenge not found`);
    }

    await lastValueFrom(
      this.clientChallenges.emit('delete-challenge', challenge),
    );
  }
}
