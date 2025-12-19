import { Meta } from '../../src/domain/models/Meta';
import * as dao from '../../src/data/metaDAO';

export const createMeta = async (meta: Meta) => {
  // validate
  if (!meta.title || !meta.days || meta.days.length === 0) throw new Error('Invalid meta');
  return await dao.createMeta(meta);
};

export const getMetasByPillar = async (pillar: string) => {
  return await dao.getMetasByPillar(pillar);
};
