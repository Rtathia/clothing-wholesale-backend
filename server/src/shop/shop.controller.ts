import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ShopService } from './shop.service';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  // 获取筛选数据（一次性获取所有分类）
  @Get('filter-data')
  async getFilterData() {
    return this.shopService.getFilterData();
  }

  // 获取分类列表
  @Get('categories')
  async getCategories() {
    return this.shopService.getCategories();
  }

  // 获取布料列表
  @Get('fabrics')
  async getFabrics() {
    return this.shopService.getFabrics();
  }

  // 获取工艺列表
  @Get('crafts')
  async getCrafts() {
    return this.shopService.getCrafts();
  }

  // 获取版型列表
  @Get('fits')
  async getFits() {
    return this.shopService.getFits();
  }

  // 获取款式列表
  @Get('styles')
  async getStyles() {
    return this.shopService.getStyles();
  }

  // 获取T恤颜色图片
  @Get('tshirt-colors')
  async getTshirtColors() {
    return this.shopService.getTshirtColors();
  }

  // 获取产品列表
  @Get('products')
  async getProducts(
    @Query('categoryId') categoryId?: string,
    @Query('fabricId') fabricId?: string,
    @Query('craftId') craftId?: string,
    @Query('fitId') fitId?: string,
    @Query('styleId') styleId?: string,
  ) {
    const filters: { 
      categoryId?: number; 
      fabricId?: number; 
      craftId?: number;
      fitId?: number;
      styleId?: number;
    } = {};
    if (categoryId) filters.categoryId = parseInt(categoryId, 10);
    if (fabricId) filters.fabricId = parseInt(fabricId, 10);
    if (craftId) filters.craftId = parseInt(craftId, 10);
    if (fitId) filters.fitId = parseInt(fitId, 10);
    if (styleId) filters.styleId = parseInt(styleId, 10);
    return this.shopService.getProducts(Object.keys(filters).length > 0 ? filters : undefined);
  }

  // 获取产品详情
  @Get('products/:id')
  async getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.shopService.getProductById(id);
  }
}
