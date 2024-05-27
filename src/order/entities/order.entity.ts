import { User } from 'src/auth/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Item } from './item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Item, (item) => item.order, { eager: true, cascade: true })
  items: Item[];

  @ManyToOne(() => User)
  user: User;

  @Column()
  total: number;

  @CreateDateColumn()
  createdDate: Date;
}
