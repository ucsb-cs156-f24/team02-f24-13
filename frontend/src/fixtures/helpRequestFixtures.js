const helpRequestFixtures = {
  firstRequest: {
    id: 13,
    requesterEmail: "dude101@gmail.com",
    teamId: "t-13",
    tableOrBreakoutRoom: "13",
    requestTime: "2022-01-02T12:00:00",
    explanation: "check frontend",
    solved: false,
  },
  otherRequests: [
    {
      id: 13,
      requesterEmail: "bob@gmail.com",
      teamId: "t-2",
      tableOrBreakoutRoom: "13",
      requestTime: "2022-01-02T12:30:00",
      explanation: "not working",
      solved: false,
    },
    {
      id: 22,
      requesterEmail: "steve@gmail.com",
      teamId: "t-1",
      tableOrBreakoutRoom: "5",
      requestTime: "2022-04-03T14:37:00",
      explanation: "false",
      solved: true,
    },
    {
      id: 35,
      requesterEmail: "imposter@gmail.com",
      teamId: "t-3",
      tableOrBreakoutRoom: "8",
      requestTime: "2022-07-04T09:98:00",
      explanation: "incorrect",
      solved: false,
    },
  ],
};

export { helpRequestFixtures };
