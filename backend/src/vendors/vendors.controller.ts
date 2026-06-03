import { Body, Controller, Post } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { VendorsService } from './vendors.service';

@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}
  @Post()
  create(@Body() body: CreateVendorDto) {
    return this.vendorsService.create(body);
  }
}
