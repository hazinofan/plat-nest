import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Blog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: 'text'})
    content: string;

    @Column({ name: 'coverImage', type: 'varchar', nullable: false })
    coverImage: string;

    @CreateDateColumn()
    createdAt: Date; 
}
