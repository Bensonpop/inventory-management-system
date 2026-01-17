import { Injectable } from '@nestjs/common';
import { FifoStrategy } from './fifo.strategy';
import { FefoStrategy } from './fefo.strategy';
import { BatchStrategy } from './batch.strategy';
import { StockDeductionStrategy } from './stock-deduction.strategy';
import { InventoryOutMode } from 'src/business/entities/business.entity';

@Injectable()
export class StrategyFactory {
  constructor(
    private readonly fifo: FifoStrategy,
    private readonly fefo: FefoStrategy,
    private readonly batch: BatchStrategy,
  ) {}

  getStrategy(outMode: InventoryOutMode): StockDeductionStrategy {
    switch (outMode) {
      case InventoryOutMode.FIFO:
        return this.fifo;
      case InventoryOutMode.FEFO:
        return this.fefo;
      case InventoryOutMode.BATCH:
        return this.batch;
      default:
        throw new Error('Invalid inventory strategy');
    }
  }
}
