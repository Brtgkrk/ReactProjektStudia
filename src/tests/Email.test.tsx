import React from 'react';
import { render, fireEvent, screen, waitFor, getByRole } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter, BrowserRouter as Router } from 'react-router-dom';

import UserPage from '../components/UserPage';

test("renders component", async () => {
  const { getByText, queryByText } = render(
    <MemoryRouter initialEntries={["/uzytkownicy/Bret"]}>
        <UserPage loggedInUser={"Bret"} />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(queryByText('Email: Sincere@april.biz')).toBeInTheDocument(); // User Breat and its personal info should be loaded on the page

    fireEvent.click(screen.getByText('Email: Sincere@april.biz')); // Try to change user email
    expect(queryByText('Zapisz')).toBeInTheDocument();
    expect(queryByText('Anuluj')).toBeInTheDocument();

    const inputElement = screen.getByPlaceholderText('wprowadz wartosc')
    fireEvent.change(inputElement, { target: { value: 'email@email.com' } });

    expect(inputElement.getAttribute('value')).toBe('email@email.com'); // Check if user email is changed
    fireEvent.click(screen.getByText('Zapisz'));
  });

  await waitFor(() => {
    expect(queryByText('Email: email@email.com')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Email: email@email.com'));
    const inputElement = screen.getByPlaceholderText('wprowadz wartosc')

    fireEvent.change(inputElement, { target: { value: 'bademail.com' } }); // Try to write incorrect email
    fireEvent.click(screen.getByText('Zapisz'));

    expect(queryByText('Wprowadź poprawny adres email')).toBeInTheDocument();
  });
});