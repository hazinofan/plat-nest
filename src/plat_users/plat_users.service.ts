import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PlatUsers } from './entities/plat_user.entity';
import { Orders } from './entities/order.entity';
import { Coupons } from './entities/coupons.entity';
import { Tickets } from './entities/ticket-support.entity';

@Injectable()
export class PlatUsersService {
    constructor(
        @InjectRepository(PlatUsers)
        private usersRepository: Repository<PlatUsers>,
        @InjectRepository(Orders)
        private ordersRepository: Repository<Orders>,
        @InjectRepository(Coupons)
        private couponsRepository: Repository<Coupons>,
        @InjectRepository(Tickets)
        private ticketsRepository: Repository<Tickets>,
        private jwtService: JwtService,
    ) { }

    async register(userData: Partial<PlatUsers>) {
        const existingUser = await this.usersRepository.findOne({
            where: [{ email: userData.email }, { username: userData.username }],
        });

        if (existingUser) {
            if (existingUser.email === userData.email) {
                throw new BadRequestException("Cet email est déjà utilisé.");
            }
            if (existingUser.username === userData.username) {
                throw new BadRequestException("Ce nom d'utilisateur est déjà pris.");
            }
        }

        const user = this.usersRepository.create(userData);
        return this.usersRepository.save(user);
    }


    async validateUser(email: string, password: string): Promise<PlatUsers | null> {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return null;

        return user;
    }

    async login(email: string, password: string) {
        const user = await this.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { id: user.id, email: user.email, username: user.username, avatar: user.avatar, country: user.country, tel: user.phone_number, full_name: user.full_name };
        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }

    async getAllUsers(): Promise<PlatUsers[]> {
        return await this.usersRepository.find({
            relations: {
                coupons: true,
                orders: true,
                ticket: true
            }
        })
    }

    async getUserById(id: number): Promise<PlatUsers> {
        return await this.usersRepository.findOne({
            where: { id },
            relations: {
                coupons: true,
                orders: true,
                ticket: true
            }
        })
    }

    async createOrderForUser(userId: number, total_price: number, products: string[]) {
        let user = await this.usersRepository.findOne({
            where: { id: userId },
            relations: ['orders', 'coupons'],
        });

        if (!user) {
            throw new NotFoundException("User not found.");
        }

        // Create and save the order with product names
        const order = this.ordersRepository.create({
            user,
            total_price,
            status: false,
            products,
        });
        await this.ordersRepository.save(order);

        const coupon = this.couponsRepository.create({
            user,
            code: this.generateCouponCode(),
            discount: 10,
            expiry_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            status: 'active',
        });
        await this.couponsRepository.save(coupon);

        // Reload user to reflect changes
        user = await this.usersRepository.findOne({
            where: { id: userId },
            relations: ['orders', 'coupons'],
        });

        return { order, coupon, user };
    }



    // 🔹 **Generate a Random Coupon Code**
    private generateCouponCode(): string {
        return 'COUPON-' + Math.random().toString(36).substr(2, 8).toUpperCase();
    }

    async createTicket(userId: number, subject: string, message: string) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException("User not found.");
        }

        const ticket = this.ticketsRepository.create({ user, subject, message });
        return await this.ticketsRepository.save(ticket);
    }

    // 🔹 **Remove a Ticket**
    async removeTicket(ticketId: number, userId: number) {
        const ticket = await this.ticketsRepository.findOne({
            where: { id: ticketId },
            relations: ['user'],
        });

        if (!ticket) {
            throw new NotFoundException("Ticket not found.");
        }

        if (ticket.user.id !== userId) {
            throw new UnauthorizedException("You can't delete this ticket.");
        }

        await this.ticketsRepository.remove(ticket);
        return { message: "Ticket removed successfully" };
    }

    // Delete Coupons
    async deleteCoupon(userId: number, couponId: number): Promise<{ message: string }> {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            relations: ['coupons'],
        });

        if (!user) {
            throw new NotFoundException("User not found.");
        }

        const coupon = await this.couponsRepository.findOne({ where: { id: couponId, user: { id: userId } } });

        if (!coupon) {
            throw new NotFoundException("Coupon not found or does not belong to this user.");
        }

        await this.couponsRepository.delete(couponId);
        return { message: "Coupon deleted successfully" };
    }

    async changePassword(userId: number, currentPassword: string, newPassword: string) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException("User not found.");
        }

        // ✅ Check if the current password is correct
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Current password is incorrect.");
        }

        // ✅ Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        // ✅ Save the new password
        await this.usersRepository.save(user);

        return { message: "Password updated successfully." };
    }

    async updateUserInfo(id: number, updateData: Partial<PlatUsers>) {
        const user = await this.usersRepository.findOne({ where: { id } });
        Object.assign(user, updateData);

        await this.usersRepository.save(user);
        return { message: "User information updated successfully.", user };
    }


}
