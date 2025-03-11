import { slugify } from 'transliteration';
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';

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

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;   

    @BeforeInsert()
    generateSlug() {
        this.slug = slugify(this.title); // Automatically generate slug from title
    }
}
