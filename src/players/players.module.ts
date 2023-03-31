import { Module } from '@nestjs/common';
import { ProxyRmqModule } from 'src/proxyrmq/proxyrmq.module';
import { PlayersController } from './players.controller';
import { AwsModule } from 'src/aws/aws.module';

@Module({
  imports: [ProxyRmqModule, AwsModule],
  controllers: [PlayersController]
})
export class PlayersModule { }
