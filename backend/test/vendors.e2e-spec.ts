import request from 'supertest';
import { createTestApp, resetDatabase } from './test-app';
import type { INestApplication } from '@nestjs/common';
import type { Server } from 'node:http';
import type { PrismaService } from '../prisma/prisma.service';

type VendorResponse = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
};

type ErrorResponse = {
  message: string;
  errors: {
    field: string;
    constraints: Record<string, string>;
  }[];
};

describe('Vendors e2e', () => {
  let app: INestApplication;
  let http: Server;
  let prisma: PrismaService;

  beforeAll(async () => {
    ({ app, http, prisma } = await createTestApp());
  });

  beforeEach(async () => {
    await resetDatabase(prisma);
  });

  afterAll(async () => {
    await app.close();
  });

  // create
  it('creates a vendor and returns it from GET /vendors', async () => {
    const input = {
      name: 'Atlas Office Supplies',
      email: 'contact@atlasoffice.com',
      phone: '+212600000001',
      website: 'https://atlasoffice.com',
      notes: 'Office supplies vendor',
    };

    const createResponse = await request(http)
      .post('/vendors')
      .send(input)
      .expect(201);

    const createdVendor = createResponse.body as VendorResponse;

    expect(createdVendor).toMatchObject({
      ...input,
      archivedAt: null,
    });

    expect(createdVendor.id).toEqual(expect.any(String));
    expect(Number.isNaN(Date.parse(createdVendor.createdAt))).toBe(false);
    expect(Number.isNaN(Date.parse(createdVendor.updatedAt))).toBe(false);

    const listResponse = await request(http).get('/vendors').expect(200);

    const vendorsList = listResponse.body as VendorResponse[];

    expect(vendorsList).toHaveLength(1);
    expect(vendorsList[0]).toMatchObject({
      id: createdVendor.id,
      ...input,
      archivedAt: null,
    });
  });
  it('refuses vendor creation with invalid payload and returns 400', async () => {
    const input = {
      email: 'contact@atlasoffice.com',
      phone: '+212600000001',
      website: 'https://atlasoffice.com',
      notes: 'Office supplies vendor',
    };

    const response = await request(http)
      .post('/vendors')
      .send(input)
      .expect(400);

    const error = response.body as ErrorResponse;

    expect(error.message).toBe('Validation failed');
    const nameError = error.errors.find(
      (validationError) => validationError.field === 'name',
    );

    expect(nameError).toBeDefined();
    if (!nameError) {
      throw new Error('Expected validation error for "name"');
    }

    expect(typeof nameError.constraints.isString).toBe('string');
    expect(typeof nameError.constraints.isNotEmpty).toBe('string');

    const listResponse = await request(http).get('/vendors').expect(200);

    const vendorsList = listResponse.body as VendorResponse[];

    expect(vendorsList).toHaveLength(0);
  });
});
