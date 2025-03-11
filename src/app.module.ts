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
import { PlatUsersModule } from './plat_users/plat_users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ✅ Load environment variables
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
      extra: { supportBigNumbers: true, dateStrings: true },
    }),
    ProductsModule,
    AuthModule,
    UsersModule,
    BlogsModule,
    MailerModule,
    PlatUsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
