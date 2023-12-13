import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// Service
import { SaleService } from './sale.service';

@Controller('sale')
@ApiTags('sale')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}
}
