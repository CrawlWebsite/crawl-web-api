import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// Service
import { ApartmentService } from './apartment.service';

@Controller('apartment')
@ApiTags('apartment')
export class ApartmentController {
  constructor(private readonly apartmentService: ApartmentService) {}
}
