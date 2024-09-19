import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import placeholderImage from "../../asset/Images/Default_Recipe_Image.jpg";
import { RecipeCreate } from "../../types/RecipeCreate";
import "./RecipeDetails.css";
import vegLogo from "../../asset/Images/veg lable.png";
import nonvegLogo from "../../asset/Images/nonveg lable.jpg";
import axios from "axios";
import { IoCloseSharp } from "react-icons/io5";
import { getAllRecipes } from "../../service/FetchRecipies";
interface LocationState {
  recipe?: RecipeCreate;
}
interface RouteParams {
  id: string;
}
const RecipeDetails: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<RouteParams>();
  const location = useLocation<LocationState>();
  const recipe = location.state?.recipe;
  const [data, setData] = useState<any>();

  const filterRecipes = (id: string, data: any) => {
    setData(
      data.find(
        (item: { recipeId: { toString: () => string } }) =>
          item.recipeId.toString() === id
      )
    );
  };

  useEffect(() => {
    fetchRecipes();
  },[]);

  const fetchRecipes = async () => {
    try {
      const data = await getAllRecipes();
      filterRecipes(id, data);
    } catch (error) {
      console.error("Error fetching recipe", error);
    }
  };

  if (!data) {
    return <p>Recipe not found</p>;
  }

  const convertMinutesToHoursAndMinutes = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
  };

  const { hours, minutes } = convertMinutesToHoursAndMinutes(
    data.preparationTime
  );

  const handleClose = () => {
    history.push("/home");
  };

  return (
    <div className="recipe-details-page">
      <button className="close-button" onClick={handleClose}>
        <IoCloseSharp />
      </button>
      <h1>{data.title}</h1>
      <img
        src={data.image || placeholderImage}
        alt={data.image ? data.title : "Placeholder Image"}
        className="recipe-image"
      />
      <p className="recipe-category">
        {" "}
        <strong>Category:</strong> {data.category}
        <img
          src={data.category === "NonVeg" ? nonvegLogo : vegLogo}
          alt={data.category === "NonVeg" ? "Non-Veg" : "Veg"}
          className="category-logo"
        />
      </p>{" "}
      <p>
        <strong>Preparation Time:</strong>{" "}
        {hours > 0 && `${hours} hr${hours > 1 ? "s" : ""} `}
        {minutes > 0 && `${minutes} min${minutes > 1 ? "s" : ""}`}
      </p>
      <h4>Ingredients:</h4>
      <p>{data.ingredients.split(", ")}</p>
      <h4>Instructions:</h4>
      <p>{data.cookingInstruction || "No instructions available"}</p>
    </div>
  );
};

export default RecipeDetails;
