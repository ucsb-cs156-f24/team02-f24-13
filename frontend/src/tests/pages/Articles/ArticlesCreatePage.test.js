import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import ArticlesCreatePage from "main/pages/Articles/ArticlesCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

// Mock react-toastify
const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

// Mock react-router-dom's Navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    Navigate: (props) => {
      mockNavigate(props.to);
      return null;
    },
  };
});

describe("ArticlesCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);
  let queryClient;

  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);

    queryClient = new QueryClient();
    jest.spyOn(queryClient, "invalidateQueries");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("ArticlesForm-title")).toBeInTheDocument();
    });
  });

  test("when you fill in the form and hit submit, it makes a request to the backend and invalidates cache", async () => {
    const article = {
      id: 1,
      title: "My First Article",
      url: "https://example.com",
      explanation: "This is an example article",
      email: "author@example.com",
      dateAdded: "2024-11-09T00:00",
    };

    axiosMock.onPost("/api/articles/post").reply(202, article);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("ArticlesForm-title")).toBeInTheDocument();
    });

    const titleField = screen.getByTestId("ArticlesForm-title");
    const urlField = screen.getByTestId("ArticlesForm-url");
    const explanationField = screen.getByTestId("ArticlesForm-explanation");
    const emailField = screen.getByTestId("ArticlesForm-email");
    const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    fireEvent.change(titleField, { target: { value: "My First Article" } });
    fireEvent.change(urlField, { target: { value: "https://example.com" } });
    fireEvent.change(explanationField, {
      target: { value: "This is an example article" },
    });
    fireEvent.change(emailField, { target: { value: "author@example.com" } });
    fireEvent.change(dateAddedField, { target: { value: "2024-11-09T00:00" } });

    fireEvent.click(submitButton);

    // Verify the backend request was made
    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));
    expect(axiosMock.history.post[0].params).toEqual({
      title: "My First Article",
      url: "https://example.com",
      explanation: "This is an example article",
      email: "author@example.com",
      dateAdded: "2024-11-09T00:00",
    });

    // Verify that the toast and navigation occurred
    expect(mockToast).toBeCalledWith(
      "New article Created - id: 1 title: My First Article",
    );
    expect(mockNavigate).toBeCalledWith("/articles");

    // Assert cache invalidation logic
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith([
      "/api/articles/all",
    ]);
  });
});
