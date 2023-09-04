import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from '../interfaces/user.interface';
import { encryptPassword } from 'src/utils/handleBcrypt';
import { Document } from 'src/documents/entities/document.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Favorite } from 'src/favorites/entities/favorite.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column('text')
  name: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
    nullable: false,
  })
  role: UserRole;

  @Column('boolean', {
    default: true,
  })
  isActive: boolean;

  @Column('boolean', {
    default: false,
  })
  isDeleted: boolean;

  @OneToMany(() => Document, (document) => document.user)
  documents: Document[];

  @OneToMany(() => Comment, (document) => document.user)
  comments: Comment[];

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await encryptPassword(this.password);
  }

  @BeforeInsert()
  checkFields() {
    this.email = this.email.toLowerCase().trim();
  }
}
