import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
  ) {}

  signUp({ username, password }: AuthCredentialsDto) {
    return this.dataSource.transaction(async (manager) => {
      const repo = manager.withRepository(this.userRepo);
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await repo.create({ username, password: hashedPassword });
      try {
        return { id: (await repo.save(user)).id };
      } catch (err) {
        if (err.errno === 19) {
          throw new ConflictException('Username already exists');
        } else {
          throw new InternalServerErrorException(
            'Something went wrong during user creation',
          );
        }
      }
    });
  }

  async validateUser({ username, password }: AuthCredentialsDto) {
    const user = await this.userRepo.findOneBy({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  findUserBy(where: FindOptionsWhere<User>) {
    const user = this.userRepo.findOneBy(where);
    if (!user) throw new NotFoundException();
    return user;
  }

  login(user: Partial<User>) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async makeAdmin(userId: string) {
    const user = await this.findUserBy({ id: userId });
    user.isAdmin = true;
    return this.dataSource.transaction(async (manager) => {
      manager.save(user);
    });
  }
}
