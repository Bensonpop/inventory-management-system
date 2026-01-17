export class SaleResponseDto {
  sale_id: string;
  deductions: {
    batch_no: string;
    quantity: number;
  }[];
}
