export class StockSummaryBatchDto {
  batchNo: string;
  quantity: number;
  purchaseDate: Date;
  expiryDate: Date | null;
}

export class StockSummaryDto {
  businessId: string;
  productId: string;
  totalQuantity: number;
  batches: StockSummaryBatchDto[];
}
