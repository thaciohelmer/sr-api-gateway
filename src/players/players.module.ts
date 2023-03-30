import { Module } from '@nestjs/common';
import { ProxyRmqModule } from 'src/proxyrmq/proxyrmq.module';
import { PlayersController } from './players.controller';

@Module({
  imports: [ProxyRmqModule],
  controllers: [PlayersController]
})
export class PlayersModule { }
