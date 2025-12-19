import { Meta } from '../../src/domain/models/Meta';

// Stubbed DAO: implement using sqliteRepository in production
export const createMeta = async (meta: Meta): Promise<string> => {
  // return inserted id
  return 'm_stub_1';
};

export const getMetaById = async (id: string): Promise<Meta | null> => {
  return null;
};

export const getMetasByPillar = async (pillar: string): Promise<Meta[]> => {
  return [];
};

export const updateMeta = async (meta: Meta): Promise<void> => {};

export const deleteMeta = async (id: string): Promise<void> => {};
