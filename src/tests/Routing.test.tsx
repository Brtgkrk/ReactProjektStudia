import React from 'react';
import { render, fireEvent, screen, waitFor, getByRole } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter, BrowserRouter as Router} from 'react-router-dom';
import App from '../App';
import userEvent from '@testing-library/user-event';

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

  await waitFor(() => {
    expect(queryByText('sunt aut facere repellat provident occaecati excepturi optio reprehenderit')).toBeInTheDocument(); // Check if page is routed to PostPage
  });
});