import { Controller, Post, Body, Get, Param, ParseIntPipe, NotFoundException, Delete, UseGuards, Patch } from '@nestjs/common';
import { PlatUsersService } from './plat_users.service';
import { AuthGuard } from '@nestjs/passport';
import { PlatUsers } from './entities/plat_user.entity';

@Controller('users')
export class PlatUsersController {
    constructor(private readonly platUsersService: PlatUsersService) { }

    @Post('register')
    async register(@Body() userData: any) {
        return this.platUsersService.register(userData);
    }

    @Post('login')
    async login(@Body() { email, password }: { email: string; password: string }) {
        return this.platUsersService.login(email, password);
    }

    @Get()
    async getUsers() {
        const users = await this.platUsersService.getAllUsers()
        if (!users) {
            throw new NotFoundException('User Not found !');
        }
        return users
    }

    @Get(':id')
    async getUserById(@Param('id', ParseIntPipe) id: number) {
        const user = await this.platUsersService.getUserById(id);
        if (!user) {
            throw new NotFoundException('User not found.');
        }
        return user;
    }

    @Post(':id/orders')
    async createOrder(
        @Param('id', ParseIntPipe) id: number,
        @Body('total_price', ParseIntPipe) total_price: number,
        @Body('products') products: string[]
    ) {
        return await this.platUsersService.createOrderForUser(id, total_price, products);
    }

    // 🔹 **Create a Ticket**
    @Post(':id/tickets')
    async createTicket(
        @Param('id', ParseIntPipe) id: number,
        @Body('subject') subject: string,
        @Body('message') message: string
    ) {
        return this.platUsersService.createTicket(id, subject, message);
    }

    // 🔹 **Delete a Ticket**
    @Delete(':id/tickets/:ticketId')
    async removeTicket(
        @Param('id', ParseIntPipe) userId: number,
        @Param('ticketId', ParseIntPipe) ticketId: number
    ) {
        return this.platUsersService.removeTicket(ticketId, userId);
    }

    // 🔹 **Delete a Coupon**
    @Delete(':id/coupons/:couponId')
    async deleteCoupon(
        @Param('id', ParseIntPipe) userId: number,
        @Param('couponId', ParseIntPipe) couponId: number
    ) {
        return this.platUsersService.deleteCoupon(userId, couponId);
    }

    @Patch(':id/change-password')
    async changePassword(
        @Param('id', ParseIntPipe) id: number,
        @Body('currentPassword') currentPassword: string,
        @Body('newPassword') newPassword: string
    ) {
        return this.platUsersService.changePassword(id, currentPassword, newPassword);
    }

    @Patch(':id/update')
    async updateUserInfo(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateData: Partial<PlatUsers>
    ) {
        return this.platUsersService.updateUserInfo(id, updateData);
    }

}
