import React from 'react';
import { render, fireEvent, screen, waitFor, getByRole } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter} from 'react-router-dom';

import UserPage from '../components/UserPage';

test("phone test", async () => {
  const { getByText, queryByText } = render(
    <MemoryRouter initialEntries={["/uzytkownicy/Bret"]}>
        <UserPage loggedInUser={"Bret"} />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(queryByText('Telefon: 1-770-736-8031 x56442')).toBeInTheDocument(); // default phone number on profile page
  });
  fireEvent.click(screen.getByText('Telefon: 1-770-736-8031 x56442'));

  // Check if change box is avaiable
  expect(queryByText('Zapisz')).toBeInTheDocument();
  expect(queryByText('Anuluj')).toBeInTheDocument();

  // Write incorrect phone number
  const inputElement = screen.getByPlaceholderText('wprowadz wartosc')
  fireEvent.change(inputElement, { target: { value: 'n13pr4w1dl0wy-t3l3f0n' } });
  fireEvent.click(screen.getByText('Zapisz'));
  expect(queryByText('Wprowadź poprawny numer telefonu (9 cyfr)')).toBeInTheDocument();

  // Write correct phone number
  fireEvent.click(screen.getByText('Telefon: 1-770-736-8031 x56442'));
  fireEvent.change(inputElement, { target: { value: '123456789' } });
  expect(inputElement.getAttribute('value')).toBe('123456789');
  fireEvent.click(screen.getByText('Zapisz'));
  expect(queryByText('Telefon: 123456789')).toBeInTheDocument();
});