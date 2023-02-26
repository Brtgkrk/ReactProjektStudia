import React from "react";
import "../styles/NavigationBar.css";

type NavigationBarProps = {
  loggedInUser: string | null;
};

const NavigationBar: React.FC<NavigationBarProps> = ({ loggedInUser }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">Forum React</div>
      <div className="navbar-right">Witaj, {loggedInUser}!</div>
    </nav>
  );
};

export default NavigationBar;