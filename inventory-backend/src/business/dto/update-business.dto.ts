import { IsEnum } from 'class-validator';
import { InventoryOutMode } from '../entities/business.entity';

export class UpdateInventoryConfigDto {
  @IsEnum(InventoryOutMode)
  outMode: InventoryOutMode;
}
