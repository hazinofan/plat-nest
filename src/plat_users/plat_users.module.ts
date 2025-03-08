import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PlatUsers } from './entities/plat_user.entity';
import { PlatUsersService } from './plat_users.service';
import { PlatUsersController } from './plat_users.controller';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { Orders } from './entities/order.entity';
import { Coupons } from './entities/coupons.entity';
import { Tickets } from './entities/ticket-support.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([PlatUsers, Orders, Coupons, Tickets]),
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'your-secret-key',
            signOptions: { expiresIn: '1d' },
        }),
    ],
    providers: [PlatUsersService, JwtStrategy],
    controllers: [PlatUsersController],
})          
export class PlatUsersModule {}
