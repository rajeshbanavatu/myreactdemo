import React from "react";
import Login from "./Login";
import { Router } from "react-router-dom";
import { render, cleanup } from "@testing-library/react";
import { createMemoryHistory } from "history";
import * as AuthService from "../Services/AuthService";

jest.mock("../Services/AuthService");

afterEach(cleanup);

function renderWithRouter(
  ui,
  {
    route = "/",
    history = createMemoryHistory({ initialEntries: [{ route }] })
  } = {}
) {
  return {
    ...render(<Router history={history}>{ui}</Router>),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history
  };
}

const sel = id => `[data-testid="${id}"]`;

test("authenticated user redirects to initial route", () => {
  const mockProps = { location: { state: { from: "/test" } } };
  const { history } = renderWithRouter(
    <Login isAuthenticated={true} {...mockProps} />
  );
  expect(history.location.pathname).toBe("/test");
});

test("unauthenticated user calls login", () => {
  const mockProps = { location: { state: { from: "/test" } } };
  renderWithRouter(<Login isAuthenticated={false} {...mockProps} />);
  expect(AuthService.login).toHaveBeenCalledTimes(1);
});
