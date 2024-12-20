import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { articlesFixtures } from "fixtures/articlesFixtures";
import ArticlesTable from "main/components/Articles/ArticlesTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { toast } from "react-toastify";

// Mocking react-router-dom's useNavigate
const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

// Mocking react-toastify to prevent actual toasts during tests
jest.mock("react-toastify", () => ({
  toast: jest.fn(),
}));

describe("ArticlesTable deleteMutation tests", () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Has the expected column headers and content for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesTable
            articles={articlesFixtures.threeArticles}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedHeaders = [
      "ID",
      "Title",
      "URL",
      "Explanation",
      "Email",
      "Date Added",
    ];
    const expectedFields = [
      "id",
      "title",
      "url",
      "explanation",
      "email",
      "dateAdded",
    ];
    const testId = "ArticlesTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByRole("columnheader", { name: headerText });
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const cell = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(cell).toBeInTheDocument();
      expect(cell).toHaveTextContent(articlesFixtures.threeArticles[0][field]);
    });

    // Ensure Edit and Delete buttons are not present for ordinary users
    const editButton = screen.queryByTestId(
      `${testId}-cell-row-0-col-Edit-button`,
    );
    expect(editButton).not.toBeInTheDocument();

    const deleteButton = screen.queryByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).not.toBeInTheDocument();
  });

  test("Has the expected column headers and content for admin user", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesTable
            articles={articlesFixtures.threeArticles}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedHeaders = [
      "ID",
      "Title",
      "URL",
      "Explanation",
      "Email",
      "Date Added",
      "Edit",
      "Delete",
    ];
    const expectedFields = [
      "id",
      "title",
      "url",
      "explanation",
      "email",
      "dateAdded",
    ];
    const testId = "ArticlesTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByRole("columnheader", { name: headerText });
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const cell = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(cell).toBeInTheDocument();
      expect(cell).toHaveTextContent(articlesFixtures.threeArticles[0][field]);
    });

    // Ensure Edit and Delete buttons are present for admin users
    const editButtons = screen.getAllByTestId(
      /ArticlesTable-cell-row-.*-col-Edit-button/,
    );
    expect(editButtons.length).toBe(3);
    editButtons.forEach((button) => {
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("btn-primary");
    });

    const deleteButtons = screen.getAllByTestId(
      /ArticlesTable-cell-row-.*-col-Delete-button/,
    );
    expect(deleteButtons.length).toBe(3);
    deleteButtons.forEach((button) => {
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("btn-danger");
    });
  });

  test("Edit button navigates to the edit page for admin user", async () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesTable
            articles={articlesFixtures.threeArticles}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(`ArticlesTable-cell-row-0-col-id`),
      ).toHaveTextContent("1");
    });

    const editButton = screen.getByTestId(
      `ArticlesTable-cell-row-0-col-Edit-button`,
    );
    fireEvent.click(editButton);

    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith("/articles/edit/1"),
    );
  });

  test("Delete button calls delete callback and invalidates queries", async () => {
    const currentUser = currentUserFixtures.adminUser;
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock
      .onDelete("/api/articles")
      .reply(200, { message: "Article deleted" });

    const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesTable
            articles={articlesFixtures.threeArticles}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(`ArticlesTable-cell-row-0-col-id`),
      ).toHaveTextContent("1");
    });

    const deleteButton = screen.getByTestId(
      `ArticlesTable-cell-row-0-col-Delete-button`,
    );
    fireEvent.click(deleteButton);

    await waitFor(() => expect(axiosMock.history.delete.length).toBe(1));
    expect(axiosMock.history.delete[0].url).toBe("/api/articles");
    expect(axiosMock.history.delete[0].params).toEqual({ id: 1 });

    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith("Article deleted successfully"),
    );

    // Ensure invalidateQueries was called with the correct key
    await waitFor(() => {
      expect(invalidateQueriesSpy).toHaveBeenCalledWith(["/api/articles/all"]);
    });
  });
});
