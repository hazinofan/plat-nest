import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Orders } from "./order.entity";
import { Coupons } from "./coupons.entity";
import { Tickets } from "./ticket-support.entity";

@Entity()
export class PlatUsers {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    full_name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    country: string;

    @Column()
    phone_number: string;

    @Column()
    password: string;

    @Column({ nullable: true, default: '/assets/avatar.jpg' })
    avatar: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
    
    @Column({ type: 'datetime', nullable: true })
    updated_at: Date;    


    // One user can have multiple orders
    @OneToMany(() => Orders, (order) => order.user, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    orders: Orders[];

    @OneToMany(() => Tickets, (ticket) => ticket.user, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    ticket: Tickets[];

    // One user can have multiple coupons
    @OneToMany(() => Coupons, (coupon) => coupon.user, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    coupons: Coupons[];

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }
}
