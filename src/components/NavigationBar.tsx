import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Types
import { User } from "../types/User";
// Styles
import "../styles/NavigationBar.css";

type NavigationBarProps = {
  loggedInUser: string | null;
};



const NavigationBar: React.FC<NavigationBarProps> = ({ loggedInUser }) => {
  let users: any[];
  let loggedInUserData : User;
  useEffect(() => {
  const fetchUsers = async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      users = await response.json();
      loggedInUserData = users.find((user) => user.name === loggedInUser);

  };
  fetchUsers();
  });

  const navigate = useNavigate();
  
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div onClick={() => navigate(`/`)}>Forum React</div>
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
      </div>
      <div className="navbar-right" onClick={() => navigate(`/uzytkownicy/${loggedInUserData.username}`)}>Witaj, {loggedInUser}!</div>
    </nav>
  );
};

export default NavigationBar;