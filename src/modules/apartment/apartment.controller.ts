import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// Service
import { ApartmentService } from './apartment.service';

@Controller('apartment')
@ApiTags('Apartment')
export class ApartmentController {
  constructor(private readonly apartmentService: ApartmentService) {}
}
