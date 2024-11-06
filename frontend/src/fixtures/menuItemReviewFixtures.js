const menuItemReviewFixtures = {
  oneMenuItemReview: {
    id: 1,
    itemId: 1,
    reviewerEmail: "dqiao@ucsb.edu",
    stars: 5,
    dateReviewed: "2024-05-05T05:05:05",
    comments: "very good",
  },
  threeMenuItemReviews: [
    {
      id: 1,
      itemId: 1,
      reviewerEmail: "dqiao@ucsb.edu",
      stars: 5,
      dateReviewed: "2024-05-05T05:05:05",
      comments: "very good",
    },
    {
      id: 2,
      itemId: 2,
      reviewerEmail: "phtcon@ucsb.edu",
      stars: 4,
      dateReviewed: "2024-06-06T06:06:06",
      comments: "just good, not great",
    },
    {
      id: 3,
      itemId: 3,
      reviewerEmail: "djensen@ucsb.edu",
      stars: 0,
      dateReviewed: "2024-07-07T07:07:07",
      comments: "horrendous",
    },
  ],
};

export { menuItemReviewFixtures };
