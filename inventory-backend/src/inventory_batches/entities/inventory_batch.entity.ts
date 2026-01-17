import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity({ name: 'inventory_batches' })
@Index(['businessId', 'productId', 'batchNo'], { unique: true })
export class InventoryBatch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'business_id', type: 'uuid' })
  businessId: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ name: 'batch_no', type: 'varchar', length: 50 })
  batchNo: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ name: 'purchase_date', type: 'date' })
  purchaseDate: Date;

  @Column({ name: 'expiry_date', type: 'date', nullable: true })
  expiryDate: Date | null;

  @Column({ name: 'cost_price', type: 'numeric' })
  costPrice: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
