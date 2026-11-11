// Editable editorial copy. Add technical specifications only after verification.
export const features = [
  {
    id: "sound",
    name: "Sound",
    eyebrow: "01 / YOUR OWN FREQUENCY",
    title: ["Get lost in", "the listening."],
    description: "A little distance from the everyday. A little closer to your favorite sound.",
    detail: "ACOUSTIC HOUSING",
    note: "Your soundtrack, front and center.",
  },
  {
    id: "comfort",
    name: "Comfort",
    eyebrow: "02 / MADE TO FIT YOUR DAY",
    title: ["Find your", "comfort zone."],
    description:
      "A soft silicone ear tip brings a considered touch to your everyday listening ritual.",
    detail: "SILICONE EAR TIP",
    note: "A softer point of contact.",
  },
  {
    id: "controls",
    name: "Touch",
    eyebrow: "03 / A LITTLE TOUCH GOES FAR",
    title: ["Stay in", "your rhythm."],
    description: "Keep the moment moving with touch controls, right on the outer stem.",
    detail: "TOUCH SURFACE",
    note: "Right where you need it.",
  },
  {
    id: "portability",
    name: "Portability",
    eyebrow: "04 / READY WHEN YOU ARE",
    title: ["Good things.", "Small package."],
    description:
      "Earbuds, charging case, and a place in your pocket. Bring your listening ritual along.",
    detail: "CHARGING CASE",
    note: "A home for your sound.",
  },
];

export type ProductFeature = (typeof features)[number];
