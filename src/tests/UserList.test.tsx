import React from 'react';
import { render, fireEvent, screen, waitFor, getByRole } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter, BrowserRouter as Router} from 'react-router-dom';
import App from '../App';

test("user list test", async () => {
  const { getByText, queryByText } = render(
    <Router>
        <App />
    </Router>
  );

  await waitFor(() => {
    expect(queryByText('React Forum')).toBeInTheDocument();
  });
  
  const inputElement = screen.getByPlaceholderText('Nazwa użytkownika')
  fireEvent.change(inputElement, { target: { value: 'Bret' } });
  fireEvent.click(screen.getByText('Zaloguj się'));

  await waitFor(() => {
    expect(queryByText('Zalogowano jako Leanne Graham')).toBeInTheDocument(); // Check if user is properly logged
  });

  fireEvent.click(screen.getByText('☰')); // Route into UserList
  fireEvent.click(screen.getByText('Użytkownicy'));

  await waitFor(() => {
    expect(queryByText('Wszyscy użytkownicy:')).toBeInTheDocument(); // Check if page is routed to UserList
    expect(queryByText('Nazwa użytkownika: Bret')).toBeInTheDocument(); // Check if user Bret is on the list
  });

  const inptDescription = screen.getByPlaceholderText('Wyszukaj użytkownika') // Find all users with 'clementin' in they names
  fireEvent.change(inptDescription, { target: { value: 'clementin' } });

  await waitFor(() => {
    expect(queryByText('Nazwa użytkownika: Samantha')).toBeInTheDocument(); // Check if username Samantha (Clementine Bauch) is on the list
    expect(queryByText('Nazwa użytkownika: Moriah.Stanton')).toBeInTheDocument(); // Check if username Moriah.Stanton (Clementina DuBuque) is on the list
    expect(queryByText('Nazwa użytkownika: Bret')).not.toBeInTheDocument(); // Check if username Bret is NOT in the list (her name is Leanne Graham not Clementin)
  });
});