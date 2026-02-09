import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders app brand", () => {
  render(<App />);
  const heading = screen.getByText(/LinkShortener Pro/i);
  expect(heading).toBeInTheDocument();
});
