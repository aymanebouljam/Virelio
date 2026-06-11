import {
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';

describe('VendorsService', () => {
  let service: VendorsService;

  const findManyMock = jest.fn();
  const findFirstOrThrowMock = jest.fn();
  const findUniqueOrThrowMock = jest.fn();
  const createMock = jest.fn();
  const updateMock = jest.fn();

  const prisma = {
    vendor: {
      findMany: findManyMock,
      findFirstOrThrow: findFirstOrThrowMock,
      findUniqueOrThrow: findUniqueOrThrowMock,
      create: createMock,
      update: updateMock,
    },
  } as unknown as PrismaService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new VendorsService(prisma);
  });

  it('findAll returns active vendors ordered by createdAt desc', async () => {
    const vendors = [{ id: '1', name: 'Atlas', archivedAt: null }];
    findManyMock.mockResolvedValue(vendors);

    const result = await service.findAll();

    expect(result).toEqual(vendors);
    expect(findManyMock).toHaveBeenCalledWith({
      where: { archivedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('findOne returns vendor by id', async () => {
    const id = '1';
    const vendor = { id, name: 'Atlas', archivedAt: null };
    findUniqueOrThrowMock.mockResolvedValueOnce(vendor);

    await expect(service.findOne(id)).resolves.toEqual(vendor);
    expect(findUniqueOrThrowMock).toHaveBeenLastCalledWith({
      where: {
        id,
        archivedAt: null,
      },
    });
  });

  it('findOne throws not found exception for non existent vendor id', async () => {
    const id = '999';
    findUniqueOrThrowMock.mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('Record not found', {
        code: 'P2025',
        clientVersion: 'test',
      }),
    );

    await expect(service.findOne(id)).rejects.toBeInstanceOf(NotFoundException);
    expect(findUniqueOrThrowMock).toHaveBeenLastCalledWith({
      where: {
        id,
        archivedAt: null,
      },
    });
  });

  it('update rejects empty body', async () => {
    await expect(service.update('vendor-id', {})).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('archive rejects already archived vendor', async () => {
    const archived = {
      id: '1',
      name: 'Atlas',
      archivedAt: new Date(),
    };

    findUniqueOrThrowMock.mockResolvedValue(archived);

    await expect(service.archive('1')).rejects.toBeInstanceOf(
      ConflictException,
    );

    expect(findUniqueOrThrowMock).toHaveBeenCalledWith({
      where: { id: '1' },
    });

    expect(updateMock).not.toHaveBeenCalled();
  });
});
