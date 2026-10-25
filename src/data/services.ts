import { images, type StudioImage } from "../content/images.ts";

export type Service = {
  title: string;
  image: StudioImage;
};

export const services: Service[] = [
  { title: "Food photography", image: images.pizzaBoard },
  { title: "Café photography", image: images.bowlSesame },
  { title: "Beverage photography", image: images.cocktailNight },
  { title: "Reels", image: images.garnishDrop },
  { title: "Social imagery", image: images.latteHand },
  { title: "Campaign visuals", image: images.latteOverhead },
];
