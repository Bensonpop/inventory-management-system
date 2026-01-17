import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { InventoryOutMode } from '../entities/business.entity';

export class CreateBusinessDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(InventoryOutMode)
  outMode: InventoryOutMode;
}
