import React from 'react';
import { render, fireEvent, screen, waitFor, getByRole, queryByAltText } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter, BrowserRouter as Router} from 'react-router-dom';
import App from '../App';

test("photos test", async () => {
  const { getByText, queryByText, queryAllByAltText } = render(
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

  fireEvent.click(screen.getByText('☰')); // Route into PhotosPage
  fireEvent.click(screen.getByText('Zdjęcia'));

  await waitFor(() => {
    expect(queryByText('Wyszukiwarka zdjęć')).toBeInTheDocument(); // Check if page is routed to Photos
    const altElement = screen.queryByAltText(
        "accusamus beatae ad facilis cum similique qui sunt"
      );
      expect(altElement).toBeNull();
  });

  const inptDescription = screen.getByPlaceholderText('Podaj ID zdjęcia')
  fireEvent.change(inptDescription, { target: { value: '1' } });
  fireEvent.click(screen.getByText('Pokaż zdjęcie'));
});