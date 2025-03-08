import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import { PlatUsers } from "./plat_user.entity";

@Entity()
export class Orders {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    total_price: number;

    @Column({type: 'json'})
    products: string[];

    @Column({default: false})
    status: boolean;  

    @CreateDateColumn()
    created_at: Date;

    // Each order belongs to a single user
    @ManyToOne(() => PlatUsers, (user) => user.orders, { onDelete: "CASCADE" })
    user: PlatUsers;
}
