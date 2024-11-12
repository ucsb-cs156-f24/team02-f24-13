const helpRequestFixtures = {
  oneRequest: {
    id: 1,
    requesterEmail: "dude101@gmail.com",
    teamId: "t-13",
    tableOrBreakoutRoom: "13",
    requestTime: "2022-01-02T12:00:00",
    explanation: "check frontend",
    solved: false,
  },
  threeRequests: [
    {
      id: 1,
      requesterEmail: "bob@gmail.com",
      teamId: "t-2",
      tableOrBreakoutRoom: "13",
      requestTime: "2022-01-02T12:30:00",
      explanation: "not working",
      solved: false,
    },
    {
      id: 2,
      requesterEmail: "steve@gmail.com",
      teamId: "t-1",
      tableOrBreakoutRoom: "5",
      requestTime: "2032-09-03T18:39:00",
      explanation: "false",
      solved: true,
    },
    {
      id: 3,
      requesterEmail: "imposter@gmail.com",
      teamId: "t-3",
      tableOrBreakoutRoom: "8",
      requestTime: "2030-07-08T09:98:00",
      explanation: "incorrect",
      solved: false,
    },
  ],
};

export { helpRequestFixtures };
