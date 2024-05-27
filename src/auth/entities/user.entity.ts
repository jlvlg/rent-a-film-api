import { Exclude } from 'class-transformer';
import { Rating } from 'src/movie/entities/rating.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ default: false })
  @Exclude({ toPlainOnly: true })
  isAdmin: boolean;

  @OneToMany(() => Rating, (rating) => rating.user, { cascade: true })
  @Exclude({ toPlainOnly: true })
  ratings: Rating[];
}
