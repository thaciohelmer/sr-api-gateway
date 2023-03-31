import { Module } from '@nestjs/common';
import { ChallengesController } from './challenges.controller';
import { ProxyRmqModule } from 'src/proxyrmq/proxyrmq.module';

@Module({
  imports: [ProxyRmqModule],
  controllers: [ChallengesController]
})
export class ChallengesModule { }
