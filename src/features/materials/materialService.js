import materials from '@/data/materials.json';

export function getAllMaterials() {
  return materials;
}

export function getMaterialById(id) {
  return materials.find((m) => m.id === id) || null;
}
