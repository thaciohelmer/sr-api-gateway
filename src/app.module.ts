import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { PlayersModule } from './players/players.module';
import { PlayersController } from './players/players.controller';
import { CategoriesController } from './categories/categories.controller';
import { ProxyRmqModule } from './proxyrmq/proxyrmq.module';
import { ClientProxySmartRanking } from './proxyrmq/client-proxy';

@Module({
  imports: [CategoriesModule, PlayersModule, ProxyRmqModule],
  controllers: [CategoriesController, PlayersController],
  providers: [ClientProxySmartRanking],
})
export class AppModule { }
