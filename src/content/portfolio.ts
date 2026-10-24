import { images, type StudioImage } from "./images.ts";

export type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: StudioImage;
};

export const portfolio: PortfolioItem[] = [
  {
    id: "plated-burger",
    title: "Plated hospitality",
    category: "Food photography",
    description: "A burger and fries arranged for a quiet table still.",
    image: images.burgerNight,
  },
  {
    id: "bowl-light",
    title: "Window light",
    category: "Food photography",
    description: "A sauced bowl held in natural light beside the dining room.",
    image: images.bowlWindow,
  },
  {
    id: "pizza-still",
    title: "Menu still",
    category: "Restaurant branding",
    description: "A pizza board photographed for a dark, considered menu look.",
    image: images.pizzaDark,
  },
  {
    id: "fried-plate",
    title: "Commercial plate",
    category: "Food photography",
    description: "A fried fillet, fries, and sauces kept simple and readable.",
    image: images.friedPeri,
  },
  {
    id: "paired-drinks",
    title: "Two glasses",
    category: "Beverage photography",
    description: "A pair of tall drinks composed on dark wood.",
    image: images.cocktailsPair,
  },
  {
    id: "iced-pour",
    title: "Iced pour",
    category: "Café content",
    description: "Iced coffee set against a saturated cloth and chair.",
    image: images.icedCoffee,
  },
  {
    id: "studio-glass",
    title: "Studio glass",
    category: "Beverage photography",
    description: "A layered drink isolated for a clean commercial frame.",
    image: images.cocktailStudio,
  },
  {
    id: "sauce-line",
    title: "Sauce line",
    category: "Commercial visuals",
    description: "A fried plate with a clear row of sauces for menu use.",
    image: images.friedFusion,
  },
  {
    id: "table-wrap",
    title: "Table wrap",
    category: "Café content",
    description: "A wrapped roll plated for a café menu still.",
    image: images.wrapPlate,
  },
];
