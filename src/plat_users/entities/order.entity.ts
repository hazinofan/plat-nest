import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PlatUsers } from "./plat_user.entity";

@Entity()
export class Orders {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    total_price: number;

    @Column({ type: 'text', transformer: {
        to: (value: string[]) => JSON.stringify(value), 
        from: (value: string) => JSON.parse(value) 
    }})
    products: string[];
    

    @Column({ default: false })
    status: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    // Each order belongs to a single user
    @ManyToOne(() => PlatUsers, (user) => user.orders, { onDelete: "CASCADE" })
    user: PlatUsers;
}
