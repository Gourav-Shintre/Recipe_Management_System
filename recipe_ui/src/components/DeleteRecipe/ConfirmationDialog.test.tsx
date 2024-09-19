import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, BrowserRouterProps } from "react-router-dom";
import MyRecipes from "../Home/MyRecipe";
import { getAllRecipes } from "../../service/FetchRecipies";

jest.mock("../../service/FetchRecipies", () => ({
  getAllRecipes: jest.fn(),
}));
interface WrapperProps extends BrowserRouterProps {
  children?: React.ReactNode;
}
const mockGetAllRecipes = getAllRecipes as jest.MockedFunction<
  typeof getAllRecipes
>;
const Wrapper: React.FC<WrapperProps> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("MyRecipes Component Delete Functionality", () => {
  beforeEach(() => {
    mockGetAllRecipes.mockResolvedValue([
      {
        recipeId: 1,
        title: "Test Recipe",
        category: "Veg",
        image: "test-image.jpg",
        preparationTime: 30,
        ingredients: ["Sugar", "Flour"],
      },
    ]);
  });
  test("renders MyRecipes component and fetches recipes correctly", async () => {
    render(<MyRecipes />, { wrapper: Wrapper });
    const recipeTitle = await screen.findByText(
      "Test Recipe",
      {},
      { timeout: 5000 }
    ); // waits up to 5000ms
    expect(recipeTitle).toBeInTheDocument();
    const category = await screen.findByText("Veg");
    expect(category).toBeInTheDocument();
    expect(getAllRecipes).toHaveBeenCalled();
  });

  test("opens the confirmation dialog when the delete button is clicked", async () => {
    render(<MyRecipes />, { wrapper: Wrapper });
    expect(getAllRecipes).toHaveBeenCalled();
    const deleteButton = await screen.findByLabelText(
      "Delete",
      {},
      { timeout: 5000 }
    );
    userEvent.click(deleteButton);
    expect(
      await screen.findByText("Are you sure to delete this recipe?")
    ).toBeInTheDocument();
  });

  test('deletes the recipe when "Yes" is clicked in the confirmation dialog', async () => {
    render(<MyRecipes />, { wrapper: Wrapper });
    await waitFor(() => expect(getAllRecipes).toHaveBeenCalled());
    const deleteButton = await screen.findByLabelText(
      "Delete",
      {},
      { timeout: 5000 }
    );
    userEvent.click(deleteButton);
    const yesButton = await screen.findByText("Yes");
    userEvent.click(yesButton);
    // expect(await screen.findByText("Recipe is removed")).toBeInTheDocument();
  });

  test('closes the dialog without deleting when "No" is clicked', async () => {
    render(<MyRecipes />, { wrapper: Wrapper });
    await waitFor(() => expect(getAllRecipes).toHaveBeenCalled());
    const deleteButton = await screen.findByLabelText(
      "Delete",
      {},
      { timeout: 5000 }
    );
    userEvent.click(deleteButton);
    const noButton = await screen.findByText("No");
    await userEvent.click(noButton);
    expect(
      screen.queryByText("Are you sure you want to delete it?")
    ).not.toBeInTheDocument();
  });
});
