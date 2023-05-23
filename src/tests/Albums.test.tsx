import React from 'react';
import { render, fireEvent, screen, waitFor, getByRole } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter as Router} from 'react-router-dom';

import HomePage from '../components/HomePage';

test("albums loaded properly", async () => {
  const { getByText, queryByText } = render(
    <Router>
        <HomePage loggedInUser={"Bret"} />
    </Router>
  );

  await waitFor(() => {
    expect(queryByText('Wszystkie albumy ze zdjęciami')).toBeInTheDocument(); // Check if site is loading properly
  });

  await waitFor(() => {
    expect(queryByText(/quidem molestiae enim/)).toBeInTheDocument(); // Check if first album is loaded properly
  });

  const inputElement = screen.getByPlaceholderText('Wyszukaj po twórcy')
  fireEvent.change(inputElement, { target: { value: 'ervin' } }); // Find all ervin's albums

  expect(queryByText(/quam nostrum impedit mollitia quod et dolor/)).toBeInTheDocument(); // ervin's album
  expect(queryByText(/quidem molestiae enim/)).not.toBeInTheDocument(); // other's album should not show
});