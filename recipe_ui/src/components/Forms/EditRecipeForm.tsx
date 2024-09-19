import React, { useState, useEffect } from "react";
import { storage } from "../../utility/Firebase";
import "./EditRecipeForm.css";
import { RecipeEdit } from "../../types/RecipeEdit";
import {toast ,ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useHistory, useLocation } from "react-router-dom";
import { EditRecipe } from "../../service/EditRecipe";
interface LocationState {
    recipe?: RecipeEdit;
}
const EditRecipeForm: React.FC = () => {
    const [id, setId] = useState<number>(0); // state to manage recipe Id
  const [title, setTitle] = useState<string>("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [cookingInstructions, setCookingInstructions] = useState<string>("");
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [category, setCategory] = useState<string>("Veg");
  const history = useHistory();
  const location = useLocation<LocationState>();
 
 
 
  useEffect(() => {
    if (location.state?.recipe) {
        const { recipe } = location.state;
        setId(recipe.id)
        setTitle(recipe.title);
        setIngredients(recipe.ingredients.split(","));
        setCookingInstructions(recipe.cookingInstruction);
        setImageUrl(recipe.image);
        setCategory(recipe.category);
        const hours = Math.floor(recipe.preparationTime / 60);
        console.log(recipe.preparationTime)
        const minutes = recipe.preparationTime % 60;
        console.log(minutes)
        setHours(hours);
        setMinutes(minutes);
    }
}, [location.state]);
  useEffect(() => {
    validateForm();
    isFilled();
  }, [
    title,
    ingredients,
    cookingInstructions,
    hours,
    minutes,
    imageUrl,
    category,
    touched,
  ]);
 
  const isFilled = () => {
    setIsFormValid(
      (title !== "" && !fieldErrors.title&&
        ingredients.length >= 2 &&
        ingredients.every((ingredient) => ingredient !== "") &&
        cookingInstructions.length >=20 && cookingInstructions.length <=2000 &&  !fieldErrors.instructions&&
        hours >= 0 &&
        hours <= 72 &&
        minutes <= 59 &&
        !(
          (hours === 72 && minutes > 0) ||
          (minutes !== 0 && hours === 72)||
          (minutes <5 && hours === 0)
        ))
    );
  };
 
  const upload = (file: File) => {
    const uploadTask = storage.ref(`/images/${file.name}`).put(file);
    uploadTask.on(
      'state_changed',
      (snapshot:any) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload progress:', progress);
      },
      (error:any) => {
        console.error('Upload error:', error);
      },
      () => {
        storage
          .ref('images')
          .child(file.name)
          .getDownloadURL()
          .then((url:any) => {
            setImageUrl(url);
          });
      }
    );
  };
 
  const validateForm = () => {
    let fieldErrorsTemp: { [key: string]: string } = {};
    let invalidIngredients: string[] = [];
 
    if (touched.title) {
      const trimmedTitle = title.trim();
 
      if (/^\d+$/.test(trimmedTitle)) {
        fieldErrorsTemp.title = "Title cannot contain only numbers.";
      } else if (trimmedTitle.length < 3 || trimmedTitle.length > 100) {
        fieldErrorsTemp.title =
          "Title must be between 3 and 100 characters long.";
      } else if (/[^a-zA-Z0-9\s]/.test(trimmedTitle)) {
        fieldErrorsTemp.title =
          "Some characters you've entered in the title are not allowed.";
      } else if (title.replace(/\s/g, "").length < 3) {
        fieldErrorsTemp.title =
          "Title must contain at least 3 non-space characters.";
      }
    }
 
    if (touched.ingredients) {
      ingredients.forEach((ingredient, index) => {
        const trimmedIngredient = ingredient.trim();
        let errorMessages = [];
 
        if (/^\d+$/.test(trimmedIngredient)) {
          errorMessages.push("consists of only numbers");
        }
        if (trimmedIngredient.length < 3 || trimmedIngredient.length > 15) {
          errorMessages.push(
            "length is outside the allowed range (3-15 characters)"
          );
        }
        if (/[^a-zA-Z0-9\s]/.test(trimmedIngredient)) {
          errorMessages.push("contains invalid characters");
        }
        if (trimmedIngredient.replace(/\s/g, "").length < 3) {
          errorMessages.push(
            "does not contain at least 3 non-space characters"
          );
        }
 
        if (errorMessages.length > 0) {
          invalidIngredients.push(
            `Ingredient ${index + 1} ${errorMessages.join(", ")}`
          );
        }
      });
 
      if (ingredients.length < 2) {
        fieldErrorsTemp.ingredients = "Please add at least two ingredients.";
      } else if (invalidIngredients.length > 0) {
        fieldErrorsTemp.ingredients = `${invalidIngredients.join("; ")} ${
          invalidIngredients.length > 1 ? "are" : "is"
        } not filled correctly.`;
      }
    }
 
    if (touched.cookingInstructions) {
      const trimmedInstructions = cookingInstructions.trim();
 
      if (/^\d+$/.test(trimmedInstructions)) {
        fieldErrorsTemp.instructions =
          "Instructions cannot contain only numbers.";
      } else if (
        trimmedInstructions.length < 20 ||
        trimmedInstructions.length > 2000
      ) {
        fieldErrorsTemp.instructions =
          "Instructions must be between 20 and 2000 characters long.";
      } else if (/[^0-9a-zA-Z\s,.]/.test(trimmedInstructions)) {
        fieldErrorsTemp.instructions =
          "Some characters in instructions are not allowed.";
      } else if (cookingInstructions.replace(/\s/g, "").length < 20) {
        fieldErrorsTemp.instructions =
          "Instructions must contain at least 20 non-space characters.";
      }
    }
 
    if (touched.prepTime) {
        if (hours > 72) {
          fieldErrorsTemp.prepTime =
            "Preparation time is invalid. Hours cannot exceed 72.";
        } else if (hours === 72 && minutes !== 0) {
          fieldErrorsTemp.prepTime =
            "Preparation time is invalid. When hours are 72, minutes should be 0.";
        } else if (minutes > 59){
            fieldErrorsTemp.prepTime = "Minutes cannot exceed 59.";
        }
        else if (hours === 0 && (minutes < 5 || minutes > 59)) {
          fieldErrorsTemp.prepTime =
            "Preparation time is invalid. Minutes should be between 5 and 59.";
        }
      }
 
      setFieldErrors(fieldErrorsTemp);
    };
  const handleSubmit = async () => {
    if (isFormValid) {
       
        const totalMinutes = hours * 60 + minutes;
        let preparationTime = totalMinutes;
      let ingr = ingredients.join(",");
      console.log({
        title,
        ingr,
        cookingInstructions,
        preparationTime,
        imageUrl,
        category,
      });
      const newRecipe: RecipeEdit = {
        id:id,
        title: title,
        ingredients: ingr,
        cookingInstruction: cookingInstructions,
        preparationTime: preparationTime,
        image: imageUrl,
        userId: 1,
        category: category,
      };
   
      const isSuccess = await EditRecipe(newRecipe,newRecipe.id);
      if(isSuccess===200){
        toast.success("Your recipe has been successfully updated");
        setTimeout(()=>{
            resetForm();
            history.push('/my-recipes');
     
        },4000)
      }
      else{
        toast.error("Error occured try again !!");
      }
 
 
 
    }
  };
 
  const resetForm = () => {
    setTitle("");
    setIngredients(["", ""]);
    setCookingInstructions("");
    setHours(0);
    setMinutes(0);
    setImageUrl("");
    setImage(null);
    setCategory("Veg");
    setFieldErrors({});
    setTouched({});
    setSuccess("");
  };
 
  const handleAddIngredient = () => {
    setIngredients((prev) => [...prev, ""]);
  };
 
  const handleRemoveIngredient = (index: number) => {
    setIngredients((prev) =>
      prev.length > 2 ? prev.filter((_, i) => i !== index) : prev
    );
  };
 
  const handleIngredientChange = (index: number, value: string) => {
    setIngredients((prev) =>
      prev.map((ingredient, i) => (i === index ? value : ingredient))
    );
    setTouched((prev) => ({ ...prev, ingredients: true }));
  };
 
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHours = Number(e.target.value);
    setHours(newHours);
    setTouched((prev) => ({ ...prev, prepTime: true }));
 
    if (newHours === 72) {
      setMinutes(0);
    }
  };
 
  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinutes = Number(e.target.value);
    if (hours < 72) {
      setMinutes(newMinutes);
    }
    setTouched((prev) => ({ ...prev, prepTime: true }));
  };
 
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      upload(file);
    }
  };
 
  const cancelImage = () => {
    setImage(null);
    setImageUrl("");
  };
 
  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };
 
  return (
    <div className="container">
      <div className="form-container">
        <h2>Edit Recipe</h2>
        {success && <p className="success-message">{success}</p>}
        <form>
          <div className="form-group">
            <label>Recipe Title:</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. Chicken Biryani"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => handleBlur("title")}
            />
            {fieldErrors.title && (
              <p className="error-message">{fieldErrors.title}</p>
            )}
          </div>
          <div className="form-group">
            <label>Category:</label>
            <select
              className="form-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              onBlur={() => handleBlur("category")}
            >
              <option value="Veg">Veg</option>
              <option value="NonVeg">NonVeg</option>
              <option value="Beverages">Beverages</option>
            </select>
            {fieldErrors.category && (
              <p className="error-message">{fieldErrors.category}</p>
            )}
          </div>
          <div className="form-group">
            <label>Ingredients:</label>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-group">
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. curd "
                  value={ingredient}
                  onChange={(e) =>
                    handleIngredientChange(index, e.target.value)
                  }
                  onBlur={() => handleBlur("ingredients")}
                />
                {ingredients.length > 2 && index >= 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(index)}
                    className="clear-button"
                  >
                    X
                  </button>
                )}
                {fieldErrors[`ingredient-${index}`] && (
                  <p className="error-message">
                    {fieldErrors[`ingredient-${index}`]}
                  </p>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddIngredient}
              className="add-button"
            >
              +
            </button>
            {fieldErrors.ingredients && (
              <p className="error-message">{fieldErrors.ingredients}</p>
            )}
          </div>
          <div className="form-group">
            <label>Instructions:</label>
            <textarea
              className="form-input"
              placeholder="Add instructions"
              value={cookingInstructions}
              onChange={(e) => setCookingInstructions(e.target.value)}
              onBlur={() => handleBlur("cookingInstructions")}
              rows={5}
            />
            {fieldErrors.instructions && (
              <p className="error-message">{fieldErrors.instructions}</p>
            )}
          </div>
          <div className="form-group time-input-group">
            <label>Preparation Time:</label>
            <input
              className="form-input"
              type="number"
              value={hours}
              onChange={handleHoursChange}
              min="0"
              max="72"
              placeholder="Hours"
              onBlur={() => handleBlur("prepTime")}
            />
            <span>hours</span>
            <input
              className="form-input"
              type="number"
              value={minutes}
              onChange={handleMinutesChange}
              min="5"
              max="59"
              placeholder="Minutes"
              onBlur={() => handleBlur("prepTime")}
              disabled={hours >= 72}
            />
            <span>minutes</span>
            {fieldErrors.prepTime && (
              <p className="error-message">{fieldErrors.prepTime}</p>
            )}
          </div>
          <div className="form-group image-upload">
            <label className="image-label"></label>
            <div className="image-upload-container">
              <div className="image-preview">
                {imageUrl ? (
                  <img src={imageUrl} alt="Recipe" className="recipe-current-image" />
                ) : (
                  <img
                    src="https://static.showit.co/200/C7PSKB2MT5i007KwWel7VA/shared/transparent_15plate.png"
                    alt="Placeholder"
                    className="recipe-image-placeholder"
                  />
                )}
                {imageUrl && (
                  <button
                    type="button"
                    onClick={cancelImage}
                    className="cancel-image-button"
                  >
                    X
                  </button>
                )}
              </div>
              <input
                id="imageUpload"
                className="image-upload-input"
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleImageChange}
              />
              <label htmlFor="imageUpload" className="add-image-button">
                Add Image
              </label>
            </div>
          </div>
          <div className="form-buttons">
            <button
              type="button"
              onClick={handleSubmit}
              className="submit-button"
              disabled={!isFormValid}
            >
              Submit
            </button>
            <button type="button" onClick={resetForm} className="clear-button">
              Clear
            </button>
          </div>
        </form>
       
      </div>
      <ToastContainer />
    </div>
  );
};
 
export default EditRecipeForm;