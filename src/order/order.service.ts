import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { MovieService } from 'src/movie/movie.service';
import { DataSource, In, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Item } from './entities/item.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(Item) private readonly itemRepo: Repository<Item>,
    private readonly dataSource: DataSource,
    private readonly movieService: MovieService,
  ) {}

  create({ items }: CreateOrderDto, user: User) {
    return this.dataSource.transaction(async (manager) => {
      const orderRepo = manager.withRepository(this.orderRepo);
      const itemRepo = manager.withRepository(this.itemRepo);
      const order = orderRepo.create({ user });

      const movies = await this.movieService.find(
        {
          where: { id: In(items.map((i) => i.movie_id)) },
        },
        manager,
      );
      if (movies.length != items.length) throw new NotFoundException();

      order.items = items.map((item, i) =>
        itemRepo.create({
          movie: movies[i],
          amount: item.amount,
        }),
      );

      order.total = order.items.reduce(
        (a, b) => a + b.amount * b.movie.price,
        0,
      );

      return orderRepo.save(order);
    });
  }

  async canWatchMovie(id: string, user: User) {
    if (!id) throw new BadRequestException();

    const createdDate = await this.orderRepo
      .createQueryBuilder('o')
      .select('o.createdDate')
      .innerJoin('o.items', 'i')
      .where('i.movieId = :movieId', { movieId: id })
      .andWhere('o.userId = :userId', { userId: user.id })
      .andWhere(
        "o.createdDate <= datetime(datetime(), replace('+i days', 'i', i.amount))",
      )
      .getRawOne();

    return { can: !!createdDate, until: createdDate };
  }
}
