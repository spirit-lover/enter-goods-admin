import 'reflect-metadata';
import { afterEach, describe, expect, it } from 'vitest';
import { Test, type TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { DATA_STORE } from '../src/data/contracts/data-store';

const ORIGINAL_DATA_STORE_DRIVER = process.env.DATA_STORE_DRIVER;
const ORIGINAL_PERSISTENCE_DRIVER = process.env.PERSISTENCE_DRIVER;

async function resolveStore(): Promise<{ moduleRef: TestingModule; store: { constructor: { name: string } } }> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule]
  }).compile();

  return {
    moduleRef,
    store: moduleRef.get(DATA_STORE)
  };
}

describe('DataStore provider selection', () => {
  afterEach(async () => {
    if (ORIGINAL_DATA_STORE_DRIVER === undefined) {
      delete process.env.DATA_STORE_DRIVER;
    } else {
      process.env.DATA_STORE_DRIVER = ORIGINAL_DATA_STORE_DRIVER;
    }

    if (ORIGINAL_PERSISTENCE_DRIVER === undefined) {
      delete process.env.PERSISTENCE_DRIVER;
    } else {
      process.env.PERSISTENCE_DRIVER = ORIGINAL_PERSISTENCE_DRIVER;
    }
  });

  it('默认使用 PrismaDataStore', async () => {
    delete process.env.DATA_STORE_DRIVER;
    delete process.env.PERSISTENCE_DRIVER;

    const { moduleRef, store } = await resolveStore();

    expect(store.constructor.name).toBe('PrismaDataStore');
    await moduleRef.close();
  });

  it('当 DATA_STORE_DRIVER 为 mongo 时使用 MongoDataStore', async () => {
    process.env.DATA_STORE_DRIVER = 'mongo';

    const { moduleRef, store } = await resolveStore();

    expect(store.constructor.name).toBe('MongoDataStore');
    await moduleRef.close();
  });
});
