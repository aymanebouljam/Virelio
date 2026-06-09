import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Vendor } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Injectable()
export class VendorsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Vendor[]> {
    return this.prisma.vendor.findMany({
      where: {
        archivedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    try {
      return await this.prisma.vendor.findFirstOrThrow({
        where: {
          id,
          archivedAt: null,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException({
          message: 'Resource not found',
          errors: [
            {
              field: 'id',
              constraints: {
                exists: 'No active vendor with this id exists',
              },
            },
          ],
        });
      }
      throw error;
    }
  }
  findArchived(): Promise<Vendor[]> {
    return this.prisma.vendor.findMany({
      where: {
        archivedAt: {
          not: null,
        },
      },
      orderBy: {
        archivedAt: 'desc',
      },
    });
  }
  async findOneIncludingArchived(id: string) {
    try {
      return await this.prisma.vendor.findUniqueOrThrow({
        where: {
          id,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException({
          message: 'Resource not found',
          errors: [
            {
              field: 'id',
              constraints: {
                exists: 'No vendor with this id exists',
              },
            },
          ],
        });
      }
      throw error;
    }
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

  async update(id: string, body: UpdateVendorDto) {
    if (Object.values(body).every((value) => value === undefined)) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: [
          {
            field: 'body',
            constraints: {
              isNotEmpty: 'Update body cannot be empty',
            },
          },
        ],
      });
    }
    try {
      return await this.prisma.vendor.update({
        where: { id },
        data: body,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException({
            message: 'Resource not found',
            errors: [
              {
                field: 'id',
                constraints: {
                  exists: 'No vendor with this id exists',
                },
              },
            ],
          });
        }
        if (error.code === 'P2002') {
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
      }
      throw error;
    }
  }

  async archive(id: string) {
    const vendor = await this.findOneIncludingArchived(id);
    if (vendor.archivedAt !== null) {
      throw new ConflictException({
        message: 'Resource archived',
        errors: [
          {
            field: 'archivedAt',
            constraints: {
              exists: 'This vendor is already archived',
            },
          },
        ],
      });
    }
    return this.prisma.vendor.update({
      where: { id },
      data: {
        archivedAt: new Date(),
      },
    });
  }

  async restore(id: string) {
    const vendor = await this.findOneIncludingArchived(id);
    if (vendor.archivedAt === null) {
      throw new ConflictException({
        message: 'Resource not archived',
        errors: [
          {
            field: 'archivedAt',
            constraints: {
              exists: 'This vendor is not archived',
            },
          },
        ],
      });
    }
    return this.prisma.vendor.update({
      where: { id },
      data: {
        archivedAt: null,
      },
    });
  }
}
