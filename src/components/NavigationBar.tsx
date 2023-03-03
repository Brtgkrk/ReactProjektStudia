import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDropdown from 'react-dropdown-hook'; // by Mateusz Sowiński
// Types
import { User } from "../types/User";
// Styles
import "../styles/NavigationBar.css";

type NavigationBarProps = {
  loggedInUser: string | null;
};

const NavigationBar: React.FC<NavigationBarProps> = ({ loggedInUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loggedInUserData, setLoggedInUserData] = useState<User>();

  useEffect(() => {
  const fetchUsers = async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      setUsers(await response.json());
  };
  fetchUsers();
  }, []);

  useEffect(() => {
    setLoggedInUserData(users.find((user) => user.username === loggedInUser));
   },[users])

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/');
  }

  const navigate = useNavigate();
  const [wrapperRef, dropdownOpen, toggleDropdown, closeDropdown] = useDropdown();
  
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div ref={wrapperRef} className="navbar-menu">
          <div onClick={toggleDropdown} className = "navbar-button">
            ☰
          </div>
				  {dropdownOpen &&
					<>
            <button
            className="comment-button"
            onClick={() => navigate(`/`)}>
            Strona główna
            </button>
            <button
            className="comment-button"
            onClick={() => navigate(`/posty`)}>
            Posty
            </button>
            <button
              className="comment-button"
              onClick={() => navigate(`/uzytkownicy`)}>
              Użytkownicy
            </button>
            <button
              className="comment-button"
              onClick={() => navigate(`/zdjecia`)}>
              Zdjęcia
            </button>
					</> 
				  }
          
			  </div>
      </div>
      <div className="navbar-right" onClick={() => {navigate(`/uzytkownicy/${loggedInUser}`);}  }>
        <span className="text-login">Zalogowano jako {loggedInUserData?.name}</span>
        <button className="btn-red btn-logout" onClick={handleLogout}>
        Wyloguj się
        </button>
      </div>
    </nav>
  );
};

export default NavigationBar;