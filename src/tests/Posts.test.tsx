import React from 'react';
import { render, fireEvent, screen, waitFor, getByRole } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter, BrowserRouter as Router} from 'react-router-dom';
import App from '../App';

test("posts test", async () => {
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

  fireEvent.click(screen.getByText('☰')); // Route into PostPage
  fireEvent.click(screen.getByText('Posty'));

  await waitFor(() => {
    expect(queryByText('Dodaj własny post')).toBeInTheDocument(); // Check if page is routed to PostPage
  });

  const inptTitle = screen.getByPlaceholderText('Tytuł')
  fireEvent.change(inptTitle, { target: { value: 'Post Title' } });

  const postDescription = "Specyfic post description";
  const inptDescription = screen.getByPlaceholderText('Zawartość')
  fireEvent.change(inptDescription, { target: { value: postDescription } });

  fireEvent.click(screen.getByText('Dodaj post'));
});