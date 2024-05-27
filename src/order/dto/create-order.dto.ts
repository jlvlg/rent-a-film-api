import { Type } from 'class-transformer';
import { ArrayMinSize, ValidateNested } from 'class-validator';
import { CreateItemDto } from './create-item.dto';

export class CreateOrderDto {
  @ValidateNested()
  @ArrayMinSize(1)
  @Type(() => CreateItemDto)
  items: CreateItemDto[];
}
