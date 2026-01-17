import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryBatch } from './entities/inventory_batch.entity';
import { InventoryController } from './inventory_batches.controller';
import { InventoryService } from './inventory_batches.service';
import { FifoStrategy } from './strategies/fifo.strategy';
import { FefoStrategy } from './strategies/fefo.strategy';
import { BatchStrategy } from './strategies/batch.strategy';
import { StrategyFactory } from './strategies/strategy.factory';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryBatch])],
  providers: [
    InventoryService,
    FifoStrategy,
    FefoStrategy,
    BatchStrategy,
    StrategyFactory,
  ],
  controllers: [InventoryController],
  exports: [StrategyFactory],
})
export class InventoryModule {}

