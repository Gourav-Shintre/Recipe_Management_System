import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaListAlt } from "react-icons/fa"; // Import icons from react-icons
import "./Sidebar.css";
 
interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}
 
const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  ({ isOpen, toggleSidebar }, ref) => {
    return (
      <div
        className={`sidebar ${isOpen ? "open" : ""}`}
        ref={ref}
        data-testid="sidebar"
      >
        <button className="close-button" onClick={toggleSidebar}>
          X
        </button>
        <nav className="sidebar-nav">
          <Link to="/add-recipe" className="sidebar-link">
            <FaPlus className="icon" />  Add Recipe
          </Link>
          <Link to="/my-recipes" className="sidebar-link">
            <FaListAlt className="icon" />  My Recipes
          </Link>
        </nav>
      </div>
    );
  }
);
 
export default Sidebar;