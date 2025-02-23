import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './auth/users.module';
import { AppController } from './app.controller'; 
import { AppService } from './app.service'; 
import { BlogsModule } from './blogs/blogs.module';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: "127.0.0.1",
      port: 3306,
      username: "root",
      password: "password",
      database: "platinium",
      autoLoadEntities: true,
      synchronize: true, 
    }),
    ProductsModule,
    AuthModule,
    UsersModule,
    BlogsModule,
    MailerModule,
  ],
  controllers: [AppController],
  providers: [AppService], 
})
export class AppModule {}
