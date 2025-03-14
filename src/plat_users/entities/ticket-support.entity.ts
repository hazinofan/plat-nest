import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PlatUsers } from "./plat_user.entity";

@Entity()
export class Tickets {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    subject: string;

    @Column('text')
    message: string;

    @Column({ default: 'open' }) 
    status: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
created_at: Date;

    @ManyToOne(() => PlatUsers, (user) => user.ticket, { onDelete: "CASCADE" })
    user: PlatUsers;
} 