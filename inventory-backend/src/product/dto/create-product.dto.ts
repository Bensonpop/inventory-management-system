import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  productCode: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}
