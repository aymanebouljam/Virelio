import { Injectable } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VendorsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.vendor.findMany({
      where: {
        archivedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  create(body: CreateVendorDto) {
    return this.prisma.vendor.create({
      data: body,
    });
  }
}
