import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ==================== 分类接口 ====================
  
  @Get('categories')
  async getCategories() {
    return this.adminService.getCategories();
  }

  @Post('categories')
  async createCategory(@Body() body: { name: string; icon?: string; sortOrder?: number }) {
    return this.adminService.createCategory(body);
  }

  @Put('categories/:id')
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<{ name: string; icon: string; sortOrder: number; isActive: boolean }>,
  ) {
    return this.adminService.updateCategory(id, body);
  }

  @Delete('categories/:id')
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteCategory(id);
  }

  // ==================== 布料接口 ====================
  
  @Get('fabrics')
  async getFabrics() {
    return this.adminService.getFabrics();
  }

  @Post('fabrics')
  async createFabric(@Body() body: { name: string; icon?: string; sortOrder?: number }) {
    return this.adminService.createFabric(body);
  }

  @Put('fabrics/:id')
  async updateFabric(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<{ name: string; icon: string; sortOrder: number; isActive: boolean }>,
  ) {
    return this.adminService.updateFabric(id, body);
  }

  @Delete('fabrics/:id')
  async deleteFabric(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteFabric(id);
  }

  // ==================== 工艺接口 ====================
  
  @Get('crafts')
  async getCrafts() {
    return this.adminService.getCrafts();
  }

  @Post('crafts')
  async createCraft(@Body() body: { name: string; icon?: string; sortOrder?: number }) {
    return this.adminService.createCraft(body);
  }

  @Put('crafts/:id')
  async updateCraft(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<{ name: string; icon: string; sortOrder: number; isActive: boolean }>,
  ) {
    return this.adminService.updateCraft(id, body);
  }

  @Delete('crafts/:id')
  async deleteCraft(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteCraft(id);
  }

  // ==================== 版型接口 ====================
  
  @Get('fits')
  async getFits() {
    return this.adminService.getFits();
  }

  @Post('fits')
  async createFit(@Body() body: { name: string; sortOrder?: number }) {
    return this.adminService.createFit(body);
  }

  // ==================== 款式接口 ====================
  
  @Get('styles')
  async getStyles() {
    return this.adminService.getStyles();
  }

  @Post('styles')
  async createStyle(@Body() body: { name: string; sortOrder?: number }) {
    return this.adminService.createStyle(body);
  }

  // ==================== T恤颜色图片接口 ====================
  
  @Get('tshirt-colors')
  async getTshirtColors() {
    return this.adminService.getTshirtColors();
  }

  @Post('tshirt-colors')
  async createTshirtColor(@Body() body: { name: string; colorCode?: string; imageUrl: string; sortOrder?: number }) {
    return this.adminService.createTshirtColor(body);
  }

  @Put('tshirt-colors/:id')
  async updateTshirtColor(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<{ name: string; colorCode: string; imageUrl: string; sortOrder: number; isActive: boolean }>,
  ) {
    return this.adminService.updateTshirtColor(id, body);
  }

  @Delete('tshirt-colors/:id')
  async deleteTshirtColor(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteTshirtColor(id);
  }

  // ==================== 产品接口 ====================
  
  @Get('products')
  async getProducts(
    @Query('categoryId') categoryId?: string,
    @Query('fabricId') fabricId?: string,
    @Query('craftId') craftId?: string,
  ) {
    const filters: { categoryId?: number; fabricId?: number; craftId?: number } = {};
    if (categoryId) filters.categoryId = parseInt(categoryId, 10);
    if (fabricId) filters.fabricId = parseInt(fabricId, 10);
    if (craftId) filters.craftId = parseInt(craftId, 10);
    return this.adminService.getProducts(Object.keys(filters).length > 0 ? filters : undefined);
  }

  @Get('products/:id')
  async getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getProductById(id);
  }

  @Post('products')
  async createProduct(@Body() body: {
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    categoryId?: number;
    fabricId?: number;
    craftId?: number;
    fitId?: number;
    styleId?: number;
    sortOrder?: number;
  }) {
    return this.adminService.createProduct(body);
  }

  @Put('products/:id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<{
      name: string;
      description: string;
      price: number;
      imageUrl: string;
      categoryId: number;
      fabricId: number;
      craftId: number;
      fitId: number;
      styleId: number;
      sortOrder: number;
      isActive: boolean;
    }>,
  ) {
    return this.adminService.updateProduct(id, body);
  }

  @Delete('products/:id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteProduct(id);
  }
}
