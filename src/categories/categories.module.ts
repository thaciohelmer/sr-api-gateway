import { Module } from '@nestjs/common';
import { ProxyRmqModule } from 'src/proxyrmq/proxyrmq.module';
import { CategoriesController } from './categories.controller';

@Module({
  imports: [ProxyRmqModule],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
