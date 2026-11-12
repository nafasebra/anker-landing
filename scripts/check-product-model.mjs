import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function readModel(path) {
  const buffer = readFileSync(new URL(path, import.meta.url));
  assert.equal(buffer.toString("ascii", 0, 4), "glTF");
  const jsonLength = buffer.readUInt32LE(12);
  return JSON.parse(buffer.toString("utf8", 20, 20 + jsonLength));
}

const source = readModel("../public/models/soundcore-r50i.glb");
const compressed = readModel("../public/models/soundcore-r50i-optimized.glb");
for (const name of [
  "Case_Base",
  "Lid_Hinge",
  "Earbud_Left",
  "Earbud_Right",
  "Left_Organic_Housing",
  "Left_Silicone_Tip",
  "Left_Stem",
]) {
  assert.ok(
    compressed.nodes.some((node) => node.name === name),
    `Missing runtime part: ${name}`,
  );
}

// Node hierarchy and local transforms determine the lid hinge and earbud poses.
assert.deepEqual(compressed.nodes, source.nodes);
assert.deepEqual(compressed.scenes, source.scenes);
assert.deepEqual(compressed.materials, source.materials);
assert.equal(compressed.meshes.length, source.meshes.length);
assert.ok(compressed.extensionsRequired.includes("KHR_draco_mesh_compression"));

for (let i = 0; i < source.meshes.length; i++) {
  const original = source.meshes[i].primitives;
  const optimized = compressed.meshes[i].primitives;
  assert.equal(optimized.length, original.length);
  for (let j = 0; j < original.length; j++) {
    assert.equal(optimized[j].material, original[j].material);
    const before = source.accessors[original[j].attributes.POSITION];
    const after = compressed.accessors[optimized[j].attributes.POSITION];
    // Draco may reindex vertices and remove degenerate triangles.
    for (const bound of ["min", "max"]) {
      for (let axis = 0; axis < 3; axis++) {
        assert.ok(Math.abs(after[bound][axis] - before[bound][axis]) < 0.0001);
      }
    }
  }
}

console.log("Compressed model preserves nodes, transforms, materials, and mesh bounds.");
