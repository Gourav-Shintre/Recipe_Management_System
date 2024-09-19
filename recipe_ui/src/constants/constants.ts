export const MAX_TITLE_LENGTH = 100;
export const MIN_TITLE_LENGTH = 3;
export const MAX_INGREDIENT_LENGTH = 15;
export const MIN_INGREDIENT_LENGTH = 3;
export const MAX_INSTRUCTIONS_LENGTH = 2000;
export const MIN_INSTRUCTIONS_LENGTH = 20;
export const MAX_HOURS = 72;
export const MAX_MINUTES = 59;
export const MIN_MINUTES = 5;
 
export const ERROR_MESSAGES = {
  title: {
    tooShort: `Title must be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters long.`,
    invalidChar: "Some characters you've entered in the title are not allowed.",
    onlyNumbers: "Title cannot contain only numbers.",
    minLength: "Title must contain at least 3 non-space characters.",
  },
  ingredients: {
    minCount: "Please add at least two ingredients.",
    invalid: (index: number, errors: string[]) =>
      `Ingredient ${index + 1} ${errors.join(", ")} ${
        errors.length > 1 ? "are" : "is"
      } not filled correctly.`,
  },
  instructions: {
    tooShort: `Instructions must be between ${MIN_INSTRUCTIONS_LENGTH} and ${MAX_INSTRUCTIONS_LENGTH} characters long.`,
    invalidChar: "Some characters in instructions are not allowed.",
    onlyNumbers: "Instructions cannot contain only numbers.",
    minLength: "Instructions must contain at least 20 non-space characters.",
  },
  prepTime: {
    invalidHours: `Preparation time is invalid. Hours cannot exceed ${MAX_HOURS}.`,
    invalidMinutes: "Minutes cannot exceed 59.",
    invalidRange: "Preparation time is invalid. Minutes should be between 5 and 59.",
    invalidCombo: "Preparation time is invalid. When hours are 72, minutes should be 0.",
  },
  imageUrl: "Please ensure all photo URLs begin with 'https://'.",
  form: {
    success: "Your recipe has been successfully uploaded.",
    error: "Error occurred, try again!!",
  },
};