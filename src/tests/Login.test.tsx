import React from 'react';
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter, BrowserRouter as Router } from 'react-router-dom';

import UserPage from '../components/UserPage';

test("login test", async () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={["/uzytkownicy/Bret"]}>
        <UserPage loggedInUser={"Bret"} />
    </MemoryRouter>
  );

  // Check if user is properly logged and profile page matched logged user.

  await waitFor(() => {
    expect(getByText('Zalogowano jako Leanne Graham')).toBeInTheDocument(); // Check if user is logged
    expect(getByText('Istnieje możliwość edycji danych')).toBeInTheDocument(); // Check if logged user is the same as the profile page user
  });
});
