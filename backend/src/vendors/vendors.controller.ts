import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { VendorsService } from './vendors.service';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Get()
  findAll() {
    return this.vendorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendorsService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateVendorDto) {
    return this.vendorsService.create(body);
  }
  @Patch(':id/archive')
  archive(@Param('id') id: string) {
    return this.vendorsService.archive(id);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateVendorDto) {
    return this.vendorsService.update(id, body);
  }
}
