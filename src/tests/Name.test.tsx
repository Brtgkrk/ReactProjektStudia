import React from 'react';
import { render, fireEvent, screen, waitFor, getByRole } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter as Router} from 'react-router-dom';

import UserPage from '../components/UserPage';

test("name test", async () => {
  const { getByText, queryByText } = render(
    <Router>
        <UserPage loggedInUser={"Bret"} />
    </Router>
  );

  await waitFor(() => {
    expect(queryByText('Imie i nazwisko: Leanne Graham')).toBeInTheDocument();
  });
  fireEvent.click(screen.getByText('Imie i nazwisko: Leanne Graham'));

  // Check if change box is avaiable
  expect(queryByText('Zapisz')).toBeInTheDocument();
  expect(queryByText('Anuluj')).toBeInTheDocument();

  // Write save and check name change
  const inputElement = screen.getByPlaceholderText('wprowadz wartosc')
  fireEvent.change(inputElement, { target: { value: 'Name Surname' } });
  fireEvent.click(screen.getByText('Zapisz'));
  expect(queryByText('Imie i nazwisko: Name Surname')).toBeInTheDocument();
});