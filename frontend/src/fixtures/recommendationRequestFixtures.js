const recommendationRequestFixtures = {
  oneRecommendationRequest: {
    id: 1,
    requesterEmail: "anvithakosuri@gmail.com",
    professorEmail: "dimirza@cs.ucsb.edu",
    explanation: "I would like a recommendation for UCSB BS/MS program",
    dateRequested: "2022-04-03T12:00:00",
    dateNeeded: "2022-06-04T12:00:00",
    done: false,
  },
  threeRecommendationRequests: [
    {
      id: 1,
      requesterEmail: "anvithakosuri@gmail.com",
      professorEmail: "dimirza@cs.ucsb.edu",
      explanation: "I would like a recommendation for UCSB BS/MS program",
      dateRequested: "2022-04-03T12:00:00",
      dateNeeded: "2022-06-04T12:00:00",
      done: false,
    },
    {
      id: 2,
      requesterEmail: "anvithakosuri@gmail.com",
      professorEmail: "ziad.matni@ucsb.edu",
      explanation: "I would like a recommendation for a scholarship",
      dateRequested: "2022-07-24T12:00:00",
      dateNeeded: "2022-09-04T12:00:00",
      done: true,
    },
    {
      id: 3,
      requesterEmail: "anvithakosuri@gmail.com",
      professorEmail: "pconrad@cs.ucsb.edu",
      explanation: "I would like a recommendation for PhD at Stanford",
      dateRequested: "2022-12-12T12:00:00",
      dateNeeded: "2023-01-01T12:00:00",
      done: false,
    },
  ],
};

export { recommendationRequestFixtures };
