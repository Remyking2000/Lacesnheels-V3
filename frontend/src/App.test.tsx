import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "./App";

function renderApp(initialEntry = "/") {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("App", () => {
  it("renders the home page", () => {
    renderApp();
    expect(screen.getByRole("heading", { name: /curated fashion/i })).toBeInTheDocument();
  });

  it("renders a product detail route", () => {
    renderApp("/shop/cabin-suitcase");
    expect(screen.getByRole("heading", { name: /cabin travel suitcase/i })).toBeInTheDocument();
  });
});
