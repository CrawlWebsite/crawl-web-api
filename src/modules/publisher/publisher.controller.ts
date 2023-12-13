import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// Service
import { PublisherService } from './publisher.service';

@Controller('publisher')
@ApiTags('Publisher')
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}
}
