import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  documentId: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.documents)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  categoryId: number;

  @OneToOne(() => Category, (category) => category.document)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @Column('boolean', {
    default: true,
  })
  isPublished: boolean;

  @Column('boolean', {
    default: false,
  })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
