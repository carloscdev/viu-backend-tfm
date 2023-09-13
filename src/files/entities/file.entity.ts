import { Document } from 'src/documents/entities/document.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  fileId: number;

  @Column('int')
  documentId: number;

  @ManyToOne(() => Document, (document) => document.items)
  @JoinColumn({ name: 'documentId' })
  document: Document;

  @Column('text', {
    unique: true,
  })
  name: string;

  @Column('text')
  url: string;
}
