import { IsUUID, IsInt, IsPositive, IsOptional, IsString } from 'class-validator';

export class CreateSaleDto {
  @IsUUID()
  businessId: string;

  @IsUUID()
  productId: string;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsOptional()
  @IsString()
  batchNo?: string;
  
  @IsString()
  saleReference: string; // Idempotency key
}
