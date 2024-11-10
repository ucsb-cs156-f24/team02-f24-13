import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import MenuItemReviewEditPage from "main/pages/MenuItemReview/MenuItemReviewEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

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
    useParams: () => ({
      id: 17,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("MenuItemReviewEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/menuitemreview", { params: { id: 17 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Menu Item Review");
      expect(
        screen.queryByTestId("MenuItemReview-itemId"),
      ).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock
        .onGet("/api/menuitemreview", { params: { id: 17 } })
        .reply(200, {
          id: 17,
          itemId: 21,
          reviewerEmail: "dqiao@ucsb.edu",
          stars: 5,
          dateReviewed: "2022-03-14T15:00:00.000",
          comments: "delicious",
        });
      axiosMock.onPut("/api/menuitemreview").reply(200, {
        id: "17",
        itemId: 22,
        reviewerEmail: "phtcon@ucsb.edu",
        stars: 2,
        dateReviewed: "2022-03-15T16:02:20.200",
        comments: "middling",
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemReviewForm-id");

      const idField = screen.getByTestId("MenuItemReviewForm-id");
      const itemField = screen.getByTestId("MenuItemReviewForm-itemId");
      const reviewerField = screen.getByTestId(
        "MenuItemReviewForm-reviewerEmail",
      );
      const starsField = screen.getByTestId("MenuItemReviewForm-stars");
      const dateField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
      const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
      const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");
      expect(itemField).toBeInTheDocument();
      expect(itemField).toHaveValue(21);
      expect(reviewerField).toBeInTheDocument();
      expect(reviewerField).toHaveValue("dqiao@ucsb.edu");
      expect(starsField).toBeInTheDocument();
      expect(starsField).toHaveValue(5);
      expect(dateField).toBeInTheDocument();
      expect(dateField).toHaveValue("2022-03-14T15:00");
      expect(commentsField).toBeInTheDocument();
      expect(commentsField).toHaveValue("delicious");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(itemField, {
        target: { value: 22 },
      });
      fireEvent.change(reviewerField, {
        target: { value: "phtcon@ucsb.edu" },
      });
      fireEvent.change(starsField, {
        target: { value: 2 },
      });
      fireEvent.change(dateField, {
        target: { value: "2022-03-15T16:02" },
      });
      fireEvent.change(commentsField, {
        target: { value: "middling" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "Menu Item Review Updated - id: 17 itemId: 22",
      );

      expect(mockNavigate).toBeCalledWith({ to: "/menuitemreview" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          itemId: "22",
          reviewerEmail: "phtcon@ucsb.edu",
          stars: "2",
          dateReviewed: "2022-03-15T16:02",
          comments: "middling",
        }),
      ); // posted object
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemReviewForm-id");

      const idField = screen.getByTestId("MenuItemReviewForm-id");
      const itemField = screen.getByTestId("MenuItemReviewForm-itemId");
      const reviewerField = screen.getByTestId(
        "MenuItemReviewForm-reviewerEmail",
      );
      const starsField = screen.getByTestId("MenuItemReviewForm-stars");
      const dateField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
      const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
      const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");
      expect(itemField).toBeInTheDocument();
      expect(itemField).toHaveValue(21);
      expect(reviewerField).toBeInTheDocument();
      expect(reviewerField).toHaveValue("dqiao@ucsb.edu");
      expect(starsField).toBeInTheDocument();
      expect(starsField).toHaveValue(5);
      expect(dateField).toBeInTheDocument();
      expect(dateField).toHaveValue("2022-03-14T15:00");
      expect(commentsField).toBeInTheDocument();
      expect(commentsField).toHaveValue("delicious");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(itemField, {
        target: { value: 22 },
      });
      fireEvent.change(reviewerField, {
        target: { value: "phtcon@ucsb.edu" },
      });
      fireEvent.change(starsField, {
        target: { value: 2 },
      });
      fireEvent.change(dateField, {
        target: { value: "2022-03-15T16:02:20.200" },
      });
      fireEvent.change(commentsField, {
        target: { value: "middling" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "Menu Item Review Updated - id: 17 itemId: 22",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/menuitemreview" });
    });
  });
});
