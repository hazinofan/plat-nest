import { Controller, Post, Body, Get, Param, ParseIntPipe, NotFoundException, Delete, UseGuards, Patch } from '@nestjs/common';
import { PlatUsersService } from './plat_users.service';
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

    @Delete(':id')
    async deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.platUsersService.deleteUser(id);
    }

    @Post(':id/orders')
    async createOrder(
        @Param('id', ParseIntPipe) id: number,
        @Body('total_price', ParseIntPipe) total_price: number,
        @Body('products') products: string[]
    ) {
        return await this.platUsersService.createOrderForUser(id, total_price, products);
    }

    @Get("orders")
    async getAllOrders() {
        return await this.platUsersService.findAllOrders();
    }

    // ✅ Get an order by ID
    @Get("orders/:id")
    async getOrderById(@Param("id", ParseIntPipe) id: number) {
        return await this.platUsersService.findOrderById(id);
    }

    // Get All tickets
    @Get("tickets")
    async getAllTickets() {
        return await this.platUsersService.getTickets()
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

    @Patch('tickets/:ticketId')
    async updateTicket(
        @Param('ticketId', ParseIntPipe) ticketId: number,
        @Body() updateData: Partial<{ subject: string; message: string; status: string }>
    ) {
        return this.platUsersService.updateTicket(ticketId, updateData);
    }


    @Patch(':id/update')
    async updateUserInfo(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateData: Partial<PlatUsers>
    ) {
        return this.platUsersService.updateUserInfo(id, updateData);
    }

    @Patch('orders/:id')
    async updateOrders(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateData: Partial<PlatUsers>
    ) {
        return this.platUsersService.updateOrder(id, updateData);
    }

    @Delete('orders/:id')
    async deleteOrder(@Param('id', ParseIntPipe) id: number) {
        return this.platUsersService.deleteOrder(id);
    }

    // ✅ Get a Ticket by ID
    @Get("tickets/:ticketId")
    async getTicketById(@Param("ticketId", ParseIntPipe) ticketId: number) {
        return await this.platUsersService.getTicketById(ticketId);
    }


}
