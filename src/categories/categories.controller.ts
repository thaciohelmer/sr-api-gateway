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
import { Observable } from 'rxjs';
import { CreateCategoryDto } from 'src/categories/dtos/create-category.dto';
import { UpdateCategoryDto } from 'src/categories/dtos/update-category.dto';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';

@Controller('categories')
export class CategoriesController {
  constructor(private clientProxy: ClientProxySmartRanking) {}

  private readonly clientAdmBackend = this.clientProxy.getAdmBackend();

  @Post()
  @UsePipes(ValidationPipe)
  createCategory(@Body() createCategoryDto: CreateCategoryDto): void {
    this.clientAdmBackend.emit('create-category', createCategoryDto);
  }

  @Get('/:id')
  getCategories(@Param('id') id: string): Observable<any> {
    return this.clientAdmBackend.send('get-categories', id ? id : '');
  }

  @Put('/:id')
  updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Observable<any> {
    return this.clientAdmBackend.send('update-category', {
      id,
      category: updateCategoryDto,
    });
  }

  @Delete('/:id')
  deleteCategory(@Param('id') id: string): Observable<any> {
    return this.clientAdmBackend.send('delete-category', id);
  }
}
