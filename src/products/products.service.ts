import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  // Get a product by ID
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException(`Product with ID ${id} not found.`);
    return product;
  }

  // Get All Products
  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  //add product
  async create(productData: Partial<Product>): Promise<Product> {
    const product = this.productRepository.create(productData);
    product.slug = this.generateSlug(product.name);
    return await this.productRepository.save(product);
  }

  async update(id: number, updateData: Partial<Product>): Promise<Product> {
    const product = await this.findOne(id);
    if (updateData.name && updateData.name !== product.name) {
      updateData.slug = this.generateSlug(updateData.name);
    }
    await this.productRepository.update(id, updateData);
    return this.findOne(id);
  }

  // Delete a product by ID
  async remove(id: number): Promise<void> {
    const deleteResult = await this.productRepository.delete(id);
    if (!deleteResult.affected) throw new NotFoundException(`Product with ID ${id} not found.`);
  }

  async findBySlug(slug: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { slug } });
    if (!product) {
      console.error(`Product not found: ${slug}`); // Debug log
      throw new NotFoundException(`Product with slug '${slug}' not found.`);
    }
    return product;
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-') 
      .replace(/[^\w-]+/g, ''); 
  }
}
