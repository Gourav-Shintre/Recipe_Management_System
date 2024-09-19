export interface RecipeCreate {
  recipeId: any;
  id:number;
    title: string;
    ingredients: string;
    cookingInstruction: string;
    preparationTime: number;
    image: string;
    userId: number;
    category: string;
  }