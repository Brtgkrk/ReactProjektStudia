import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/NavigationBar.css";

type NavigationBarProps = {
  loggedInUser: string | null;
};

const NavigationBar: React.FC<NavigationBarProps> = ({ loggedInUser }) => {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div onClick={() => navigate(`/`)}>Forum React</div>
        <button
          className="comment-button"
          onClick={() => navigate(`/posty`)}
        >
          Posty
        </button>
      </div>
      <div className="navbar-right">Witaj, {loggedInUser}!</div>
    </nav>
  );
};

export default NavigationBar;