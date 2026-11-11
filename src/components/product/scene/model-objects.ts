import * as THREE from "three";
export function createModelObjects(scene: THREE.Group) {
  const model = scene.clone(true);
  const left = model.getObjectByName("Earbud_Left")!;
  const right = model.getObjectByName("Earbud_Right")!;
  const hinge = model.getObjectByName("Lid_Hinge")!;
  const caseGroup = new THREE.Group();
  model.children
    .filter((child) => child !== left && child !== right)
    .forEach((child) => caseGroup.add(child));
  model.add(caseGroup);
  const materials: THREE.MeshStandardMaterial[] = [];
  model.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.material = object.material.clone();
      const material = object.material as THREE.MeshStandardMaterial;
      material.envMapIntensity = 1.5;
      materials.push(material);
    }
  });
  left.visible = right.visible = true;
  return { model, left, right, hinge, caseGroup, materials };
}
export type ModelObjects = ReturnType<typeof createModelObjects>;
