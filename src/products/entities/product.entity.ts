import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  display: string;

  @Column('text')
  description: string;
 
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ unique: true }) 
  slug: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price_before: number;

  @Column('simple-array')  
  features: string;

  @Column()
  photos: string; 

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    this.slug  = this.name
      .toLowerCase() 
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, ''); // Generate slug automatically
  }
}
 