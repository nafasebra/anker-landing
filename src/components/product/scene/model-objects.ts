import * as THREE from "three";

export const featurePartNames = ["Left_Organic_Housing", "Left_Silicone_Tip", "Left_Stem"] as const;

export function createModelObjects(scene: THREE.Group) {
  const model = scene.clone(true);
  const requirePart = (name: string) => {
    const part = model.getObjectByName(name);
    if (!part) throw new Error(`The product model is missing ${name}.`);
    return part;
  };
  const left = requirePart("Earbud_Left");
  const right = requirePart("Earbud_Right");
  const hinge = requirePart("Lid_Hinge");
  const parts = new Map(
    ["Case_Base", ...featurePartNames].map((name) => [name, requirePart(name)]),
  );
  const caseGroup = new THREE.Group();
  model.children
    .filter((child) => child !== left && child !== right)
    .forEach((child) => caseGroup.add(child));
  model.add(caseGroup);

  const materials = new Set<THREE.MeshStandardMaterial>();
  const sharedMaterials = new Map<THREE.Material, THREE.MeshStandardMaterial>();
  const highlightMaterials = new Map<string, THREE.MeshStandardMaterial[]>();
  model.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    const highlighted = featurePartNames.some((name) => name === object.name);
    const cloneMaterial = (source: THREE.MeshStandardMaterial) => {
      const shared = sharedMaterials.get(source);
      if (!highlighted && shared) return shared;
      const material = source.clone();
      material.envMapIntensity = 1.5;
      material.emissive.set("#000000");
      material.emissiveIntensity = 0;
      materials.add(material);
      if (!highlighted) sharedMaterials.set(source, material);
      return material;
    };
    const original = object.material as THREE.MeshStandardMaterial | THREE.MeshStandardMaterial[];
    const clones = Array.isArray(original) ? original.map(cloneMaterial) : cloneMaterial(original);
    object.material = clones;
    if (highlighted) highlightMaterials.set(object.name, Array.isArray(clones) ? clones : [clones]);
  });
  left.visible = right.visible = true;
  return {
    model,
    left,
    right,
    hinge,
    caseGroup,
    materials,
    parts,
    highlightMaterials,
    highlightedPart: "",
  };
}

export type ModelObjects = ReturnType<typeof createModelObjects>;

export function highlightProductPart(objects: ModelObjects, name: string) {
  if (objects.highlightedPart === name) return;
  for (const material of objects.highlightMaterials.get(objects.highlightedPart) ?? []) {
    material.emissive.set("#000000");
    material.emissiveIntensity = 0;
  }
  for (const material of objects.highlightMaterials.get(name) ?? []) {
    material.emissive.set("#1678c8");
    material.emissiveIntensity = 0.18;
  }
  objects.highlightedPart = name;
}
