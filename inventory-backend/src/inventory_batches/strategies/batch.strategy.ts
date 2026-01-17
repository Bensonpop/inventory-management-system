import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockDeductionStrategy } from './stock-deduction.strategy';
import { InventoryBatch } from '../entities/inventory_batch.entity';

@Injectable()
export class BatchStrategy implements StockDeductionStrategy {
  constructor(
    @InjectRepository(InventoryBatch)
    private readonly batchRepo: Repository<InventoryBatch>,
  ) {}

  async deductStock({ businessId, productId, quantity, batchNo }) {
    if (!batchNo) {
      throw new BadRequestException('batch_no is required for BATCH mode');
    }

    const batch = await this.batchRepo.findOne({
      where: {
        businessId,
        productId,
        batchNo,
      },
    });

    if (!batch) {
      throw new BadRequestException('Batch not found for this business');
    }

    if (batch.quantity < quantity) {
      throw new BadRequestException('Insufficient batch stock');
    }

    batch.quantity -= quantity;
    await this.batchRepo.save(batch);

    return {
      deductions: [
        {
          batchId: batch.id,
          batchNo: batch.batchNo,
          quantity,
        },
      ],
    };
  }
}

