import { Injectable } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';

@Injectable()
export class VendorsService {
  create(body: CreateVendorDto) {
    return {
      message: 'Vendor payload accepted',
      data: body,
    };
  }
}
