export const FOOD_CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Snacks", "Sweets"] as const;

export type FoodCategory = (typeof FOOD_CATEGORIES)[number];
export type FoodImageKey =
  | "kiribath"
  | "string-hoppers"
  | "pittu"
  | "kottu-roti"
  | "kokis"
  | "rice-and-curry"
  | "isso-wade";

export type Food = {
  id: string;
  name: string;
  category: FoodCategory;
  shortDescription: string;
  description: string;
  ingredients: string[];
  preparation: string[];
  imageKey: FoodImageKey;
  accent: string;
  timeMinutes: number;
  popularity: number;
};

export const FOOD_SEED: Food[] = [
  {
    id: "kiribath",
    name: "Kiribath",
    category: "Breakfast",
    shortDescription: "Coconut milk rice for a special morning.",
    description:
      "Kiribath is a beloved Sri Lankan milk rice, traditionally made for celebrations and new beginnings. It is cooked until creamy, pressed into a tray and cut into diamonds, then often served with a lively lunu miris relish.",
    ingredients: ["Short-grain rice", "Thick coconut milk", "Water", "Salt", "Red onion and chilli for lunu miris"],
    preparation: [
      "Rinse the rice and cook it with water until soft and the grains begin to break down.",
      "Stir in coconut milk and salt, then cook gently until thick and creamy.",
      "Press the warm rice into a shallow tray, allow it to set, and cut into diamonds.",
      "Serve with lunu miris or a mild curry.",
    ],
    imageKey: "kiribath",
    accent: "#E7F0EA",
    timeMinutes: 35,
    popularity: 98,
  },
  {
    id: "string-hoppers",
    name: "String Hoppers",
    category: "Breakfast",
    shortDescription: "Soft rice-flour nests, steamed to a delicate finish.",
    description:
      "String hoppers, also called idiyappam, are fine rice-flour noodles pressed into small nests and steamed. They are commonly enjoyed with coconut sambol and kiri hodi.",
    ingredients: ["Rice flour", "Boiling water", "Salt", "A little oil"],
    preparation: [
      "Mix rice flour and salt, then gradually add boiling water to make a soft dough.",
      "Press the dough through a string-hopper mould into small circular nests.",
      "Steam until set and tender, then serve warm with curry or sambol.",
    ],
    imageKey: "string-hoppers",
    accent: "#EEF1E8",
    timeMinutes: 30,
    popularity: 95,
  },
  {
    id: "pittu",
    name: "Pittu",
    category: "Breakfast",
    shortDescription: "Steamed rice flour layered with fresh coconut.",
    description:
      "Pittu is a gently crumbly steamed cylinder of rice flour and grated coconut. Across Sri Lanka it is served with coconut milk, dhal or a favourite spicy curry.",
    ingredients: ["Rice flour", "Fresh grated coconut", "Warm water", "Salt"],
    preparation: [
      "Lightly salt the rice flour and work in warm water until it resembles coarse crumbs.",
      "Layer the flour mixture with grated coconut in a pittu mould.",
      "Steam until fragrant and cooked through, then loosen gently and serve hot.",
    ],
    imageKey: "pittu",
    accent: "#F2EDE1",
    timeMinutes: 40,
    popularity: 89,
  },
  {
    id: "rice-and-curry",
    name: "Rice & Curry",
    category: "Lunch",
    shortDescription: "A colourful island plate with rice and seasonal curries.",
    description:
      "Sri Lankan rice and curry brings together steamed rice with several small curries, vegetables, sambols and greens. The exact combination changes from home to home and follows the season.",
    ingredients: ["Steamed red or white rice", "Dhal curry", "Seasonal vegetables", "Coconut", "Curry leaves and spices"],
    preparation: [
      "Cook rice until tender and prepare a dhal curry with coconut milk and spices.",
      "Make two or three vegetable curries using seasonal produce.",
      "Serve the curries alongside rice with a little sambol or fresh greens.",
    ],
    imageKey: "rice-and-curry",
    accent: "#F2E7D8",
    timeMinutes: 50,
    popularity: 93,
  },
  {
    id: "kottu-roti",
    name: "Kottu Roti",
    category: "Dinner",
    shortDescription: "Chopped roti tossed with vegetables and spice.",
    description:
      "Kottu is a much-loved Sri Lankan street-food classic. Chopped godamba roti is quickly tossed on a hot griddle with vegetables, egg and aromatic curry seasoning; every cook has a favourite variation.",
    ingredients: ["Godamba roti", "Cabbage", "Carrot", "Leeks", "Egg", "Curry powder", "Onion"],
    preparation: [
      "Slice the roti into thin strips and finely chop the vegetables.",
      "Stir-fry onion and vegetables on a hot pan, then add the egg and seasoning.",
      "Add the roti and toss or chop everything together until hot and well combined.",
    ],
    imageKey: "kottu-roti",
    accent: "#F1E6D5",
    timeMinutes: 25,
    popularity: 100,
  },
  {
    id: "isso-wade",
    name: "Isso Wade",
    category: "Snacks",
    shortDescription: "Crisp lentil fritters topped with prawns.",
    description:
      "Isso wade is a popular seaside snack: a savoury lentil fritter seasoned with chilli and curry leaves, often topped with prawns and finished with a squeeze of lime.",
    ingredients: ["Dried split peas", "Prawns", "Red onion", "Green chilli", "Curry leaves", "Salt", "Oil"],
    preparation: [
      "Soak the split peas until tender, then grind coarsely with onion and seasoning.",
      "Shape the mixture into small patties and press a prawn onto each one.",
      "Fry until crisp and golden, then serve hot with lime.",
    ],
    imageKey: "isso-wade",
    accent: "#F3E7D7",
    timeMinutes: 35,
    popularity: 88,
  },
  {
    id: "kokis",
    name: "Kokis",
    category: "Sweets",
    shortDescription: "Crisp, golden rosettes made for festive tables.",
    description:
      "Kokis are delicate, flower-shaped fried treats often prepared for Sinhala and Tamil New Year. The crisp batter is formed with a kokis mould and lifted from the oil when golden.",
    ingredients: ["Rice flour", "Coconut milk", "Egg", "Salt", "Turmeric", "Oil for frying"],
    preparation: [
      "Whisk rice flour with coconut milk, egg, salt and a pinch of turmeric into a smooth batter.",
      "Warm the kokis mould in hot oil, dip it into batter without covering the top, then lower it into the oil.",
      "Release the rosette and fry until crisp and golden; drain before serving.",
    ],
    imageKey: "kokis",
    accent: "#F4E8C9",
    timeMinutes: 40,
    popularity: 86,
  },
];
