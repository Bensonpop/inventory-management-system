import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { BusinessModule } from '../business/business.module';
import { Sale } from './entities/sale.entity';
import { SaleDeduction } from './entities/sale-deduction.entity';
import { InventoryModule } from 'src/inventory_batches/inventory_batches.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale, SaleDeduction]),
    InventoryModule,
    BusinessModule,
  ],
  providers: [SalesService],
  controllers: [SalesController],
})
export class SalesModule {}
