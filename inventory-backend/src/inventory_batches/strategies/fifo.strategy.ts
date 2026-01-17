import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { StockDeduction, StockDeductionStrategy,  } from './stock-deduction.strategy';
import { InventoryBatch } from '../entities/inventory_batch.entity';

@Injectable()
export class FifoStrategy implements StockDeductionStrategy {
  constructor(
    @InjectRepository(InventoryBatch)
    private readonly batchRepo: Repository<InventoryBatch>,
  ) {}

  async deductStock({ businessId, productId, quantity }) {
    let remaining = quantity;
    const deductions : StockDeduction []= [];

    const batches = await this.batchRepo.find({
      where: {
        businessId,
        productId,
        quantity: Not(0),
      },
      order: { purchaseDate: 'ASC' }, // FIFO = oldest first
    });

    for (const batch of batches) {
      if (remaining <= 0) break;

      const deductQty = Math.min(batch.quantity, remaining);
      batch.quantity -= deductQty;
      remaining -= deductQty;

      await this.batchRepo.save(batch);

      deductions.push({
        batchId: batch.id,
        batchNo: batch.batchNo,
        quantity: deductQty,
      });
    }

    if (remaining > 0) {
      throw new BadRequestException('Insufficient stock');
    }

    return { deductions };
  }
}
