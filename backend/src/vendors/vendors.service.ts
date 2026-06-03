import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVendorDto } from './dto/create-vendor.dto';

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

  async create(body: CreateVendorDto) {
    try {
      return await this.prisma.vendor.create({
        data: body,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException({
          message: 'Validation failed',
          errors: [
            {
              field: 'name',
              constraints: {
                isUnique: 'A vendor with this name already exists',
              },
            },
          ],
        });
      }
      throw error;
    }
  }
}
