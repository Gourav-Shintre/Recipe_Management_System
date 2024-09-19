import React, { useState } from "react";
import { FaEye, FaPencilAlt } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./DisplayRecipes.css";
import placeholderImage from "../../asset/Images/Default_Recipe_Image.jpg";
import ConfirmationDialog from "../DeleteRecipe/ConfirmationDialog";
import { DeleteRecipe } from "../../service/DeleteRecipe";

interface DisplayAllRecipesProps {
  id: number;
  title: string;
  category: string;
  image: string;
  preparationTime: number;
  ingredients: string[];
  cookingInstruction: string;
  isOnMyRecipe: boolean;
  onRecipeDelete?: () => void;
}

const DisplayAllRecipes: React.FC<DisplayAllRecipesProps> = ({
  id,
  title,
  category,
  image,
  preparationTime,
  ingredients = [],
  cookingInstruction = "",
  isOnMyRecipe,
  onRecipeDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const history = useHistory();
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentId, setCurrentId] = useState<number>(-1);

  const convertMinutesToHoursAndMinutes = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
  };

  const { hours, minutes } = convertMinutesToHoursAndMinutes(preparationTime);

  const handleExpandToggle = (id: string) => {
    history.push({
      pathname: `/recipe-details/${id}`,
    });
  };

  const handleDelete = async (id: number) => {
    console.log("Item deleted" + id);
    setShowConfirm(false);
    closeConfirmDialog();
    const isDeleted = await DeleteRecipe(id);
    if (isDeleted) {
      if (onRecipeDelete) {
        onRecipeDelete();
      }
      toast.success("Recipe deleted successfully!");
    } else {
      toast.error("Failed to remove recipe , try again!");
    }
  };

  const openConfirmDialog = (id: number) => {
    setCurrentId(id);
    document.body.style.overflow = "hidden";
    setShowConfirm(true);
  };

  const closeConfirmDialog = () => {
    document.body.style.overflow = "auto";
    setShowConfirm(false);
  };
  const handleEditClick = () => {
    console.log(id);
    history.push({
      pathname: "/edit-recipe/:" + id,
      state: {
        recipe: {
          id,
          title,
          category,
          image,
          preparationTime,
          ingredients,
          cookingInstruction,
        },
      },
    });
  };

  return (
    <>
      <div className="display-all-recipes">
        <div className={`recipe-card ${isExpanded ? "expanded" : ""}`}>
          <img
            src={image || placeholderImage}
            alt={image ? title : "Placeholder Image"}
            className="recipe-image"
          />
          <div className="recipe-info">
            <h3 className="recipe-title">{title}</h3>
            <p className="recipe-category">{category}</p>
            <p className="recipe-prep-time">
              Prep Time: {hours > 0 && `${hours} hr${hours > 1 ? "s" : ""} `}{" "}
              {minutes > 0 && `${minutes} min${minutes > 1 ? "s" : ""}`}
            </p>
          </div>
          <div className="recipe-actions">
            <>
              {isExpanded ? (
                <button
                  className="action-icon"
                  onClick={() => handleExpandToggle(id.toString())}
                  aria-label="Close"
                >
                  <IoCloseSharp />
                </button>
              ) : (
                <button
                  className="action-icon"
                  onClick={() => handleExpandToggle(id.toString())}
                  aria-label="View Details"
                >
                  <FaEye />
                </button>
              )}
              {isOnMyRecipe && (
                <>
                  <button
                    className="action-icon"
                    onClick={() => openConfirmDialog(id)}
                    aria-label="Delete"
                  >
                    <MdDelete />
                  </button>
                  <FaPencilAlt
                    className="action-icon"
                    onClick={handleEditClick}
                  />
                </>
              )}
            </>
          </div>
        </div>

        <ConfirmationDialog
          isOpen={showConfirm}
          onClose={closeConfirmDialog}
          onConfirm={() => handleDelete(currentId)}
        />
      </div>
      <ToastContainer />
    </>
  );
};

export default DisplayAllRecipes;
