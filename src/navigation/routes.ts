export const foodDetailRoute = (foodId: string) => ({
  pathname: "/foods/[foodId]" as const,
  params: { foodId },
});

export const categoryRoute = (category: string) => ({
  pathname: "/categories/[category]" as const,
  params: { category: category.toLowerCase() },
});
