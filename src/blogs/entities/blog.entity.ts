import { slugify } from 'transliteration';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BeforeInsert } from 'typeorm';

@Entity()
export class Blog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: 'text' })
    content: string;

    @Column({ name: 'coverImage', type: 'varchar', nullable: false })
    coverImage: string;

    @Column({ unique: true })
    slug: string;  // ✅ Add this field for SEO-friendly URLs

    @CreateDateColumn()
    createdAt: Date; 

    @BeforeInsert()
    generateSlug() {
        this.slug = slugify(this.title); // Automatically generate slug from title
    }
}
