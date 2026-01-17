import {
  IsUUID,
  IsString,
  IsInt,
  IsPositive,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateInventoryDto {
  @IsUUID()
  businessId: string;

  @IsUUID()
  productId: string;

  @IsString()
  batchNo: string;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsDateString()
  purchaseDate: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsPositive()
  costPrice: number;
}
