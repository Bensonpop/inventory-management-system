import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { InventoryService } from './inventory_batches.service';
import { CreateInventoryDto } from './dto/create-inventory_batch.dto';

@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) { }

  @Post('inward')
  @ApiResponse({ status: 201, description: 'Inventory added successfully' })
  addInventory(@Body() dto: CreateInventoryDto) {
    return this.inventoryService.addInventory(dto);
  }

  @Get('summary/:businessId/:productId')
  getStockSummary(
    @Param('businessId') businessId: string,
    @Param('productId') productId: string,
  ) {
    return this.inventoryService.getStockSummary(businessId, productId);
  }
}
