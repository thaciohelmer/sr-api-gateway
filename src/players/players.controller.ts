import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { Observable } from 'rxjs';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { UpdatePlayerDTO } from './dtos/update-player.dto';

@Controller('players')
export class PlayersController {
  constructor(private clientProxy: ClientProxySmartRanking) {}

  private readonly clientAdmBackend = this.clientProxy.getAdmBackend();

  @Post()
  @UsePipes(ValidationPipe)
  createPlayer(@Body() createPlayerDto: CreatePlayerDTO): void {
    const category: any = this.clientAdmBackend.send(
      'get-category',
      createPlayerDto.category,
    );

    if (category) {
      this.clientAdmBackend.emit('create-player', createPlayerDto);
    } else {
      throw new BadRequestException('Category not found');
    }
  }

  @Get('/:id')
  getPlayers(@Param('id') id: string): Observable<any> {
    return this.clientAdmBackend.send('get-players', id ? id : '');
  }

  @Put('/:id')
  updatePlayers(
    @Param('id') id: string,
    @Body() updatePlayerDto: UpdatePlayerDTO,
  ): Observable<any> {
    return this.clientAdmBackend.emit('update-player', {
      id,
      player: updatePlayerDto,
    });
  }

  @Delete('/:id')
  deletePlayer(@Param('id') id: string): Observable<any> {
    return this.clientAdmBackend.emit('delete-player', id);
  }
}
