import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import logo from "../../asset/Images/Logo.png";
import "./Header.css";
import SearchBar from "../SearchBar/SearchBar";
import { RecipeCreate } from "../../types/RecipeCreate";
import SearchResultsList from "../SearchBar/SearchResultList";
import { RecipeEdit } from "../../types/RecipeEdit";

const Header: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [results, setResults] = useState<RecipeCreate[]>([]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    window.addEventListener("storage", () => {
      const token = localStorage.getItem("token");
      if (token) {
        setisLoggedIn(true);
      } else {
        setisLoggedIn(false);
      }
    });
    //For refresh
    const token = localStorage.getItem("token");
    if (token) {
      setisLoggedIn(true);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  return !isLoggedIn ? (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <div>
            <img
              src={logo}
              alt="Profile"
              height="15px"
              style={{ width: "50px", height: "50px",}}
            />
          </div>
        </div>
      </div>
    </header>
  ) : (
    <>
      <header className="header">
        <div className="header-content">
          <div className="hamburger-menu" onClick={toggleSidebar}>
            &#9776;
          </div>
          <div className="logo">
            <Link to="/home">
              <img
                src={logo}
                alt="Profile"
                height="15px"
                style={{ width: "50px", height: "50px" }}
              />
            </Link>
          </div>
          <div className="nav">
            <div className="App">
              <div className="search-bar-container">
                <SearchBar setResults={setResults} />
                <div
                  className={`search-results ${
                    results.length > 0 ? "" : ""
                  }`}
                >
                  {results.length === 0 ? (
                    <div className="no-results">No results found</div>
                  ) : (
                    <SearchResultsList results={results} />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            <Link to="/home" className="home-button">
              Home
            </Link>
          </div>

          <div className="profilelink">
            <img
              className="profileimg"
              src="path/to/profile-image.jpg"
              alt="Profile"
            />
          </div>
        </div>
      </header>
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        ref={sidebarRef}
      />
    </>
  );
};

export default Header;
