import "@epam/uui-components/styles.css";
import "@epam/uui/styles.css";
import "@epam/assets/theme/theme_loveship.scss";
import "./index.module.scss";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserHistory } from "history";
import { Redirect, Route, Router } from "react-router-dom";
import {
  DragGhost,
  HistoryAdaptedRouter,
  useUuiServices,
  UuiContext,
} from "@epam/uui-core";
import { ErrorHandler } from "@epam/uui";
import { Modals, Snackbar } from "@epam/uui-components";
import { svc } from "./services";
import { RecipeProvider } from "./contexts/RecipeContext";

import Registration from "./components/Registration/Registration";
import Login from "./components/Login/Login";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import HomePage from "./components/Home/HomePage";
import RecipeForm from "./components/Forms/RecipeForm";
import EditRecipeForm from "./components/Forms/EditRecipeForm";
import MyRecipes from "./components/Home/MyRecipe";
import RecipeDetails from "./components/Forms/RecipeDetails";
import FullSearchResults from "./components/SearchBar/FullSearchResults";

const history = createBrowserHistory();
const router = new HistoryAdaptedRouter(history);

function UuiEnhancedApp() {
  const { services } = useUuiServices({ router });
  Object.assign(svc, services);
  return (
    <UuiContext.Provider value={services}>
      <ErrorHandler>
        <Router history={history}>
          <Route>
            <Header />
          </Route>
          <Route path="/registration" component={Registration} />
          <Route path="/login" component={Login} />
          <Route exact path="/" component={Login} />
          <Route exact path="/home" component={HomePage} />
          <Route path="/add-recipe" component={RecipeForm} />
          <Route path="/my-recipes" component={MyRecipes} />
          <Route path="/edit-recipe/:id" component={EditRecipeForm} />
          <Route path="/results" component={FullSearchResults} />
          <Route path="/recipe-details/:id" component={RecipeDetails} />

          <Route>
            <Footer />
          </Route>
        </Router>

        <Snackbar />
        <Modals />
        <DragGhost />
      </ErrorHandler>
    </UuiContext.Provider>
  );
}

function initApp() {
  const root = createRoot(window.document.getElementById("root") as Element);
  root.render(
    <>
      <RecipeProvider>
        <UuiEnhancedApp />
      </RecipeProvider>
    </>
  );
}

initApp();
