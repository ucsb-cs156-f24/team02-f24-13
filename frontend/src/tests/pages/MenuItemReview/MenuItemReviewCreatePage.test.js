import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MenuItemReviewCreatePage from "main/pages/MenuItemReview/MenuItemReviewCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("MenuItemReviewCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();
  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("MenuItemReviewForm-itemId"),
      ).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /menuitemreview", async () => {
    const queryClient = new QueryClient();
    const review = {
      id: 5,
      itemId: 6,
      reviewerEmail: "dqiao@ucsb.edu",
      stars: 5,
      dateReviewed: "2024-05-07T05:05:05",
      comments: "splendid!",
    };

    axiosMock.onPost("/api/menuitemreview/post").reply(202, review);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Item ID")).toBeInTheDocument();
    });

    const itemInput = screen.getByLabelText("Item ID");
    expect(itemInput).toBeInTheDocument();

    const reviewerInput = screen.getByLabelText("Reviewer Email");
    expect(reviewerInput).toBeInTheDocument();

    const starsInput = screen.getByLabelText("Stars");
    expect(starsInput).toBeInTheDocument();

    const dateInput = screen.getByLabelText("Date (iso format)");
    expect(dateInput).toBeInTheDocument();

    const commentInput = screen.getByLabelText("Comments");
    expect(commentInput).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    fireEvent.change(itemInput, {
      target: { value: 6 },
    });
    fireEvent.change(reviewerInput, {
      target: { value: "dqiao@ucsb.edu" },
    });
    fireEvent.change(starsInput, {
      target: { value: 5 },
    });
    fireEvent.change(dateInput, {
      target: { value: "2024-05-07T05:05:05.000" },
    });
    fireEvent.change(commentInput, {
      target: { value: "splendid!" },
    });

    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      itemId: "6",
      reviewerEmail: "dqiao@ucsb.edu",
      stars: "5",
      dateReviewed: "2024-05-07T05:05:05.000",
      comments: "splendid!",
    });

    // assert - check that the toast was called with the expected message
    expect(mockToast).toBeCalledWith(
      "New Menu Item Review Created - id: 5 itemId: 6",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/menuitemreview" });
  });
});
