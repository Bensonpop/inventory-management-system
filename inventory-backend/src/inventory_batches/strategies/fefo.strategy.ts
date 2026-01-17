import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { StockDeductionStrategy } from './stock-deduction.strategy';
import { InventoryBatch } from '../entities/inventory_batch.entity';
import { StockDeduction } from './stock-deduction.strategy';

@Injectable()
export class FefoStrategy implements StockDeductionStrategy {
  constructor(
    @InjectRepository(InventoryBatch)
    private readonly batchRepo: Repository<InventoryBatch>,
  ) {}

  async deductStock({ businessId, productId, quantity }) {
    let remaining = quantity;
    const deductions:StockDeduction [] = [];

    const batches = await this.batchRepo
      .createQueryBuilder('batch')
      .where('batch.business_id = :businessId', { businessId })
      .andWhere('batch.product_id = :productId', { productId })
      .andWhere('batch.quantity > 0')
      .andWhere(
        '(batch.expiry_date IS NULL OR batch.expiry_date >= CURRENT_DATE)',
      )
      .orderBy(
        `CASE 
          WHEN batch.expiry_date IS NULL THEN 1 
          ELSE 0 
        END`,
      )
      .addOrderBy('batch.expiry_date', 'ASC')
      .getMany();

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
