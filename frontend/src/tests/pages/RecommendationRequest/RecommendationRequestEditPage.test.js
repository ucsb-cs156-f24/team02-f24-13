import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import RecommendationRequestEditPage from "main/pages/RecommendationRequest/RecommendationRequestEditPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

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

describe("RecommendationRequestEditPage tests", () => {
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
      axiosMock
        .onGet("/api/recommendationrequests", { params: { id: 17 } })
        .timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit RecommendationRequest");
      expect(
        screen.queryByTestId("RecommendationRequest-requesterEmail"),
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
        .onGet("/api/recommendationrequests", { params: { id: 17 } })
        .reply(200, {
          id: 17,
          requesterEmail: "e@gmail.com",
          professorEmail: "e@cs.ucsb.edu",
          explanation: "e",
          dateRequested: "2022-04-03T12:00",
          dateNeeded: "2022-06-04T12:00",
          done: false,
        });
      axiosMock.onPut("/api/recommendationrequests").reply(200, {
        id: 17,
        requesterEmail: "f@gmail.com",
        professorEmail: "f@cs.ucsb.edu",
        explanation: "f",
        dateRequested: "2022-04-03T12:00",
        dateNeeded: "2022-06-04T12:00",
        done: false,
      });
    });

    const queryClient = new QueryClient();
    test("renders without crashing", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("RecommendationRequestForm-requesterEmail");
    });

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("RecommendationRequestForm-requesterEmail");

      const idField = screen.getByTestId("RecommendationRequestForm-id");
      const requesterEmailField = screen.getByTestId(
        "RecommendationRequestForm-requesterEmail",
      );
      const professorEmailField = screen.getByTestId(
        "RecommendationRequestForm-professorEmail",
      );
      const explanationField = screen.getByTestId(
        "RecommendationRequestForm-explanation",
      );
      const dateRequestedField = screen.getByTestId(
        "RecommendationRequestForm-dateRequested",
      );
      const dateNeededField = screen.getByTestId(
        "RecommendationRequestForm-dateNeeded",
      );
      const doneField = screen.getByTestId("RecommendationRequestForm-done");
      const submitButton = screen.getByTestId(
        "RecommendationRequestForm-submit",
      );

      expect(idField).toHaveValue("17");
      expect(requesterEmailField).toHaveValue("e@gmail.com");
      expect(professorEmailField).toHaveValue("e@cs.ucsb.edu");
      expect(explanationField).toHaveValue("e");
      expect(dateRequestedField).toHaveValue("2022-04-03T12:00");
      expect(dateNeededField).toHaveValue("2022-06-04T12:00");
      expect(doneField).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("RecommendationRequestForm-requesterEmail");

      const idField = screen.getByTestId("RecommendationRequestForm-id");
      const requesterEmailField = screen.getByTestId(
        "RecommendationRequestForm-requesterEmail",
      );
      const professorEmailField = screen.getByTestId(
        "RecommendationRequestForm-professorEmail",
      );
      const explanationField = screen.getByTestId(
        "RecommendationRequestForm-explanation",
      );
      const dateRequestedField = screen.getByTestId(
        "RecommendationRequestForm-dateRequested",
      );
      const dateNeededField = screen.getByTestId(
        "RecommendationRequestForm-dateNeeded",
      );
      const doneField = screen.getByTestId("RecommendationRequestForm-done");
      const submitButton = screen.getByTestId(
        "RecommendationRequestForm-submit",
      );

      expect(idField).toHaveValue("17");
      expect(requesterEmailField).toHaveValue("e@gmail.com");
      expect(professorEmailField).toHaveValue("e@cs.ucsb.edu");
      expect(explanationField).toHaveValue("e");
      expect(dateRequestedField).toHaveValue("2022-04-03T12:00");
      expect(dateNeededField).toHaveValue("2022-06-04T12:00");
      expect(doneField).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();

      fireEvent.change(requesterEmailField, {
        target: { value: "f@gmail.com" },
      });
      fireEvent.change(professorEmailField, {
        target: { value: "f@cs.ucsb.edu" },
      });
      fireEvent.change(explanationField, { target: { value: "f" } });
      fireEvent.change(dateRequestedField, {
        target: { value: "2022-04-03T12:00" },
      });
      fireEvent.change(dateNeededField, {
        target: { value: "2022-06-04T12:00" },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "Recommendation Request Updated - id: 17",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/recommendationrequest" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          requesterEmail: "f@gmail.com",
          professorEmail: "f@cs.ucsb.edu",
          explanation: "f",
          dateRequested: "2022-04-03T12:00",
          dateNeeded: "2022-06-04T12:00",
          done: false,
        }),
      ); // posted object
    });
  });
});
