import { Document } from 'src/documents/entities/document.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Favorite {
  @PrimaryGeneratedColumn()
  favoriteId: number;

  @Column('int')
  userId: number;

  @ManyToOne(() => User, (user) => user.favorites)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('int')
  documentId: number;

  @ManyToOne(() => Document, (document) => document.favorites)
  @JoinColumn({ name: 'documentId' })
  document: Document;
}
