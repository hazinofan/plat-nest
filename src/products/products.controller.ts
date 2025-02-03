import { Controller, Get, Post, Patch, Delete, Param, Body, NotFoundException, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Get a product by ID
  @Get(':id')
  async getProduct(@Param('id') id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }

  // Create a new product
  @Post()
  @UseGuards(JwtAuthGuard)
  async createProduct(@Body() productData: Partial<Product>): Promise<Product> {
    return this.productsService.create(productData);
  }

  //Get All Products
  @Get()
  async getAllProducts(): Promise<Product[]> {
    return await this.productsService.findAll()
  }

  // Update a product by ID
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateProduct(@Param('id') id: number, @Body() updateData: Partial<Product>): Promise<Product> {
    return this.productsService.update(id, updateData);
  }

  // Delete a product by ID
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteProduct(@Param('id') id: number): Promise<{ message: string }> {
    await this.productsService.remove(id);
    return { message: `Product with ID ${id} deleted successfully.` };
  }
}
