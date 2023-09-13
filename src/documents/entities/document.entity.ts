import { Category } from 'src/categories/entities/category.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Favorite } from 'src/favorites/entities/favorite.entity';
import { File } from 'src/files/entities/file.entity';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
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

  @ManyToOne(() => Category, (category) => category.documents)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column('text', {
    unique: true,
  })
  title: string;

  @Column('text')
  slug: string;

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

  @OneToMany(() => Item, (item) => item.document)
  items: Item[];

  @OneToMany(() => Comment, (comment) => comment.document)
  comments: Comment[];

  @OneToMany(() => Favorite, (favorite) => favorite.document)
  favorites: Favorite[];

  @OneToMany(() => File, (file) => file.document)
  files: File[];
}
