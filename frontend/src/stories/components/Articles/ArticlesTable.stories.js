import React from "react";
import ArticlesTable from "main/components/Articles/ArticlesTable";
import { articlesFixtures } from "fixtures/articlesFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { rest } from "msw";

export default {
  title: "components/Articles/ArticlesTable",
  component: ArticlesTable,
};

const Template = (args) => {
  return <ArticlesTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  articles: [],
  currentUser: currentUserFixtures.loggedOut,
};

export const ThreeArticlesOrdinaryUser = Template.bind({});

ThreeArticlesOrdinaryUser.args = {
  articles: articlesFixtures.threeArticles,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeArticlesAdminUser = Template.bind({});
ThreeArticlesAdminUser.args = {
  articles: articlesFixtures.threeArticles,
  currentUser: currentUserFixtures.adminUser,
};

ThreeArticlesAdminUser.parameters = {
  msw: [
    rest.delete("/api/articles/:id", (req, res, ctx) => {
      return res(
        ctx.json({ message: "Article deleted successfully!" }),
        ctx.status(200),
      );
    }),
  ],
};
