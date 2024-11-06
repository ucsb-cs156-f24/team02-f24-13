// frontend/src/tests/components/Articles/ArticlesForm.test.js

import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import ArticlesForm from "main/components/Articles/ArticlesForm";
import { articlesFixtures } from "fixtures/articlesFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("ArticlesForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>,
    );
    await screen.findByText(/Title/);
    await screen.findByText(/Create/);
  });

  test("renders correctly when passing in an Articles", async () => {
    render(
      <Router>
        <ArticlesForm initialContents={articlesFixtures.oneArticle} />
      </Router>,
    );
    await screen.findByTestId("ArticlesForm-id");
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId("ArticlesForm-id")).toHaveValue("1");
    expect(screen.getByTestId("ArticlesForm-title")).toHaveValue(
      "Andys Article",
    );
    expect(screen.getByTestId("ArticlesForm-url")).toHaveValue(
      "https://example.com",
    );
    expect(screen.getByTestId("ArticlesForm-explanation")).toHaveValue(
      "Article Number 1",
    );
    expect(screen.getByTestId("ArticlesForm-email")).toHaveValue(
      "author@example.com",
    );
    expect(screen.getByTestId("ArticlesForm-dateAdded")).toHaveValue(
      "2022-01-01T12:00",
    );
  });

  test("Correct error messages on bad input", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>,
    );
    await screen.findByTestId("ArticlesForm-title");

    const titleField = screen.getByTestId("ArticlesForm-title");
    const urlField = screen.getByTestId("ArticlesForm-url");
    const explanationField = screen.getByTestId("ArticlesForm-explanation");
    const emailField = screen.getByTestId("ArticlesForm-email");
    const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    fireEvent.change(titleField, { target: { value: "" } }); // Empty title
    fireEvent.change(urlField, { target: { value: "" } }); // Empty URL
    fireEvent.change(explanationField, { target: { value: "" } }); // Empty explanation
    fireEvent.change(emailField, { target: { value: "" } }); // Empty email
    fireEvent.change(dateAddedField, { target: { value: "" } }); // Empty dateAdded
    fireEvent.click(submitButton);

    await screen.findByText(/Title is required./);
    expect(screen.getByText(/URL is required./)).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
    expect(screen.getByText(/Email is required./)).toBeInTheDocument();
    expect(screen.getByText(/Date Added is required./)).toBeInTheDocument();
  });

  test("Correct error messages on invalid input formats", async () => {
    render(
      <Router>
        <ArticlesForm dateInputType="text" />
      </Router>,
    );
    await screen.findByTestId("ArticlesForm-title");

    const titleField = screen.getByTestId("ArticlesForm-title");
    const urlField = screen.getByTestId("ArticlesForm-url");
    const explanationField = screen.getByTestId("ArticlesForm-explanation");
    const emailField = screen.getByTestId("ArticlesForm-email");
    const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    // Provide valid inputs where required, invalid where testing pattern
    fireEvent.change(titleField, { target: { value: "Valid Title" } });
    fireEvent.change(urlField, { target: { value: "invalid-url" } });
    fireEvent.change(explanationField, {
      target: { value: "Valid explanation" },
    });
    fireEvent.change(emailField, { target: { value: "invalid-email" } });
    fireEvent.change(dateAddedField, {
      target: { value: "invalid-date" },
    });
    fireEvent.click(submitButton);

    await screen.findByText("Please enter a valid URL.");
    expect(screen.getByText("Please enter a valid URL.")).toBeInTheDocument();
    expect(
      screen.getByText("Please enter a valid email address."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Please enter a valid date and time."),
    ).toBeInTheDocument();
  });

  test("Shows error for emails with extra characters before valid email", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>,
    );
    const emailField = screen.getByTestId("ArticlesForm-email");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    fireEvent.change(emailField, {
      target: { value: "invalid user@example.com" },
    });
    fireEvent.click(submitButton);

    await screen.findByText("Please enter a valid email address.");
    expect(
      screen.getByText("Please enter a valid email address."),
    ).toBeInTheDocument();
  });

  test("Shows error for emails with extra characters after valid email", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>,
    );
    const emailField = screen.getByTestId("ArticlesForm-email");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    fireEvent.change(emailField, {
      target: { value: "user@example.com extra" },
    });
    fireEvent.click(submitButton);

    await screen.findByText("Please enter a valid email address.");
    expect(
      screen.getByText("Please enter a valid email address."),
    ).toBeInTheDocument();
  });

  test("Shows error for URLs with extra characters before valid URL", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>,
    );
    const urlField = screen.getByTestId("ArticlesForm-url");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    fireEvent.change(urlField, {
      target: { value: "invalid https://example.com" },
    });
    fireEvent.click(submitButton);

    await screen.findByText("Please enter a valid URL.");
    expect(screen.getByText("Please enter a valid URL.")).toBeInTheDocument();
  });

  test("Shows error for URLs with extra characters after valid URL", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>,
    );
    const urlField = screen.getByTestId("ArticlesForm-url");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    fireEvent.change(urlField, {
      target: { value: "https://example.com extra" },
    });
    fireEvent.click(submitButton);

    await screen.findByText("Please enter a valid URL.");
    expect(screen.getByText("Please enter a valid URL.")).toBeInTheDocument();
  });

  test("Accepts URLs with http protocol", async () => {
    const mockSubmitAction = jest.fn();
    render(
      <Router>
        <ArticlesForm submitAction={mockSubmitAction} />
      </Router>,
    );
    const titleField = screen.getByTestId("ArticlesForm-title");
    const urlField = screen.getByTestId("ArticlesForm-url");
    const explanationField = screen.getByTestId("ArticlesForm-explanation");
    const emailField = screen.getByTestId("ArticlesForm-email");
    const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    // Provide valid inputs
    fireEvent.change(titleField, { target: { value: "Sample Title" } });
    fireEvent.change(urlField, { target: { value: "http://example.com" } });
    fireEvent.change(explanationField, {
      target: { value: "Sample explanation text." },
    });
    fireEvent.change(emailField, { target: { value: "user@example.com" } });
    fireEvent.change(dateAddedField, {
      target: { value: "2022-12-31T23:59" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());
    expect(
      screen.queryByText("Please enter a valid URL."),
    ).not.toBeInTheDocument();
  });

  test("dateAdded input has type datetime-local by default", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>,
    );
    const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
    expect(dateAddedField).toHaveAttribute("type", "datetime-local");
  });

  test("Shows error for invalid date formats", async () => {
    render(
      <Router>
        <ArticlesForm dateInputType="text" />
      </Router>,
    );
    await screen.findByTestId("ArticlesForm-dateAdded");

    const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    // Provide invalid date
    fireEvent.change(dateAddedField, { target: { value: "invalid-date" } });
    fireEvent.click(submitButton);

    await screen.findByText("Please enter a valid date and time.");
    expect(
      screen.getByText("Please enter a valid date and time."),
    ).toBeInTheDocument();
  });

  test("No error messages on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <ArticlesForm submitAction={mockSubmitAction} />
      </Router>,
    );
    await screen.findByTestId("ArticlesForm-title");

    const titleField = screen.getByTestId("ArticlesForm-title");
    const urlField = screen.getByTestId("ArticlesForm-url");
    const explanationField = screen.getByTestId("ArticlesForm-explanation");
    const emailField = screen.getByTestId("ArticlesForm-email");
    const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    fireEvent.change(titleField, { target: { value: "Sample Title" } });
    fireEvent.change(urlField, { target: { value: "https://example.com" } });
    fireEvent.change(explanationField, {
      target: { value: "Sample explanation text." },
    });
    fireEvent.change(emailField, { target: { value: "user@example.com" } });
    fireEvent.change(dateAddedField, {
      target: { value: "2022-12-31T23:59" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(screen.queryByText(/Title is required./)).not.toBeInTheDocument();
    expect(screen.queryByText(/URL is required./)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Explanation is required./),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Email is required./)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Date Added is required./),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Please enter a valid URL./),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Please enter a valid email address./),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Please enter a valid date and time./),
    ).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>,
    );
    await screen.findByTestId("ArticlesForm-cancel");
    const cancelButton = screen.getByTestId("ArticlesForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
