import type { ImageSourcePropType } from "react-native";
import type { FoodImageKey } from "./foodData";

export const FOOD_IMAGES: Record<FoodImageKey, ImageSourcePropType> = {
  kiribath: require("../../assets/images/foods/kiribath.webp"),
  "string-hoppers": require("../../assets/images/foods/string-hoppers.webp"),
  pittu: require("../../assets/images/foods/pittu.webp"),
  "kottu-roti": require("../../assets/images/foods/kottu-roti.webp"),
  kokis: require("../../assets/images/foods/kokis.webp"),
  "rice-and-curry": require("../../assets/images/foods/rice-and-curry.webp"),
  "isso-wade": require("../../assets/images/foods/isso-wade.webp"),
};
