import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Patch, Query } from '@nestjs/common';
import { BlogService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Blog } from './entities/blog.entity';

@Controller('blogs')
export class BlogController {
    constructor(private readonly blogService: BlogService) { }

    @Get()
    getAllBlogs(@Query('skip') skip: number, @Query('take') take: number) {
        return this.blogService.findAll(skip, take);
    }
 
    @Get(':id')
    getBlogById(@Param('id') id: number) {
        return this.blogService.findOne(id);
    }
 
    @Get('slug/:slug')  
    getBlogBySlug(@Param('slug') slug: string) {
        return this.blogService.findBySlug(slug);
    } 

    @Post()
    @UseGuards(JwtAuthGuard)
    async createBlog(@Body() blogData: CreateBlogDto): Promise<Blog> {
        return this.blogService.create(blogData);
    }

    @Patch(':id')
    updateBlog(@Param('id') id: number, @Body() body) {
        return this.blogService.update(id, body);
    }

    @Delete(':id')
    deleteBlog(@Param('id') id: number) {
        return this.blogService.remove(id);
    }
}
