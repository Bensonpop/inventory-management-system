import { Controller, Post, Body } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { SaleResponseDto } from './dto/sale-response.dto';

@ApiTags('Sales')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @ApiResponse({ status: 201, type: SaleResponseDto })
  create(@Body() dto: CreateSaleDto) {
    return this.salesService.createSale(dto);
  }
}
