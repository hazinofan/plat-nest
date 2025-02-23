import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { slugify } from './utils/slugify';

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

    findBySlug(slug: string) {  // ✅ Find blog by slug
        return this.blogRepo.findOne({ where: { slug } });
    }

    async create(blogData: Partial<Blog>): Promise<Blog> {
        blogData.slug = slugify(blogData.title); // ✅ Generate slug from title
        const blog = this.blogRepo.create(blogData);
        return await this.blogRepo.save(blog);
    }

    async update(id: number, body) {
        if (body.title) {
            body.slug = slugify(body.title); 
        }
        await this.blogRepo.update(id, body);
        return this.findOne(id);
    }

    async remove(id: number) {
        await this.blogRepo.delete(id);
        return { message: 'Blog deleted successfully' };
    }
}
