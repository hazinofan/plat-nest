import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PlatUsers } from "./plat_user.entity";

@Entity()
export class Coupons {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    code: string;

    @Column()
    discount: number;  

    @Column()
    expiry_date: Date;

    @Column({ default: "active" })
    status: "active" | "used" | "expired";

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
created_at: Date;

    // Each coupon belongs to a single user
    @ManyToOne(() => PlatUsers, (user) => user.coupons, { onDelete: "CASCADE" })
    user: PlatUsers;
}
