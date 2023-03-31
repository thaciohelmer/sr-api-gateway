import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { Observable, lastValueFrom } from 'rxjs';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { UpdatePlayerDTO } from './dtos/update-player.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from 'src/aws/aws.service';

@Controller('api/v1/players')
export class PlayersController {

  constructor(
    private clientProxy: ClientProxySmartRanking,
    private awsService: AwsService
  ) { }

  private readonly clientAdmBackend = this.clientProxy.getAdmBackend()

  @Post()
  @UsePipes(ValidationPipe)
  createPlayer(@Body() createPlayerDto: CreatePlayerDTO): void {

    const category: any = this.clientAdmBackend.send('get-category-by-name', createPlayerDto.category)

    if (category) {
      this.clientAdmBackend.emit('create-player', createPlayerDto)
    } else {
      throw new BadRequestException('Category not found')
    }
  }

  @Get('/:id')
  getPlayerById(@Param('id') id: string): Observable<any> {
    return this.clientAdmBackend.send('get-player-by-id', id)
  }

  @Get()
  getPlayers(): Observable<any> {
    return this.clientAdmBackend.send('get-players', '')
  }

  @Put('/:id')
  updatePlayers(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDTO): Observable<any> {
    return this.clientAdmBackend.emit('update-player', { id, player: updatePlayerDto })
  }

  @Delete('/:id')
  deletePlayer(@Param('id') id: string): Observable<any> {
    return this.clientAdmBackend.emit('delete-player', id)
  }

  @Post('/:id')
  @UseInterceptors(FileInterceptor('file'))
  async fileUpload(@Param('id') id: string, @UploadedFile() file) {
    const player = await lastValueFrom(this.clientAdmBackend.send('get-players', id))

    if (!player) {
      throw new BadRequestException('Player not found')
    }

    const data = await this.awsService.fileUpload(id, file)
    const updatePlayerDto = new UpdatePlayerDTO()
    updatePlayerDto.avatarUrl = data.url

    await lastValueFrom(this.clientAdmBackend.emit('update-player', { id, player: updatePlayerDto }))

    return await lastValueFrom(this.clientAdmBackend.send('get-players', id))
  }

}
