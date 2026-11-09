import { Redirect } from "expo-router";

/**
 * Visible entry point for the Food Details screen.
 * Food cards still open the same dynamic route for the selected dish.
 */
export default function FoodDetailsTab() {
  return <Redirect href={{ pathname: "/foods/[foodId]", params: { foodId: "kiribath" } }} />;
}
