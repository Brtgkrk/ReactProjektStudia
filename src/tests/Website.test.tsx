import React from 'react';
import { render, fireEvent, screen, waitFor, getByRole } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter as Router} from 'react-router-dom';

import UserPage from '../components/UserPage';

test("empty website", async () => {
  const { getByText, queryByText } = render(
    <Router>
        <UserPage loggedInUser={"Bret"} />
    </Router>
  );

  await waitFor(() => {
    expect(queryByText('Strona: hildegard.org')).toBeInTheDocument(); // default webpage on profile page
  });
  fireEvent.click(screen.getByText('Strona: hildegard.org'));

  // Check if change box is avaiable
  expect(queryByText('Zapisz')).toBeInTheDocument();
  expect(queryByText('Anuluj')).toBeInTheDocument();

  // Write empty website address
  const inputElement = screen.getByPlaceholderText('wprowadz wartosc')
  fireEvent.change(inputElement, { target: { value: 'incorrectwebsite' } });
  fireEvent.click(screen.getByText('Zapisz'));
  expect(queryByText('Strona: hildegard.org')).toBeInTheDocument();
});

test("incorrect website", async () => {
    const { getByText, queryByText } = render(
      <Router>
          <UserPage loggedInUser={"Bret"} />
      </Router>
    );
  
    await waitFor(() => {
      expect(queryByText('Strona: hildegard.org')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Strona: hildegard.org'));
  
    // Check if change box is avaiable
    expect(queryByText('Zapisz')).toBeInTheDocument();
    expect(queryByText('Anuluj')).toBeInTheDocument();
  
    // Write empty website address
    const inputElement = screen.getByPlaceholderText('wprowadz wartosc')
    fireEvent.change(inputElement, { target: { value: 'incorrectwebsite' } }); // Try to save incorrect website
    fireEvent.click(screen.getByText('Zapisz'));
    expect(queryByText('Wprowadź poprawny adres strony internetowej')).toBeInTheDocument();
  });

test("correct website", async () => {
    const { getByText, queryByText } = render(
      <Router>
          <UserPage loggedInUser={"Bret"} />
      </Router>
    );
  
    await waitFor(() => {
      expect(queryByText('Strona: hildegard.org')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Strona: hildegard.org'));
  
    // Check if change box is avaiable
    expect(queryByText('Zapisz')).toBeInTheDocument();
    expect(queryByText('Anuluj')).toBeInTheDocument();
  
    // Write proper website address
    const inputElement = screen.getByPlaceholderText('wprowadz wartosc')
    fireEvent.change(inputElement, { target: { value: 'correct.website' } }); // Try to save correct website
    fireEvent.click(screen.getByText('Zapisz'));
    expect(queryByText('Strona: correct.website')).toBeInTheDocument();
});