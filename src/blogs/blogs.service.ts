import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';

@Injectable()
export class BlogService {
    constructor(@InjectRepository(Blog) private blogRepo: Repository<Blog>) {}

    findAll(skip: number = 0, take: number = 10) {
        return this.blogRepo.find({
            skip,
            take,
            order: { createdAt: 'DESC' }, 
        });
    }    

    findOne(id: number) {
        return this.blogRepo.findOne({ where: { id } });
    }

  async create(blogData: Partial<Blog>): Promise<Blog> {
    const product = this.blogRepo.create(blogData);
    return await this.blogRepo.save(product);
  }

    async update(id: number, body) {
        await this.blogRepo.update(id, body);
        return this.findOne(id);
    }

    async remove(id: number) {
        await this.blogRepo.delete(id);
        return { message: 'Blog deleted successfully' };
    }
}
