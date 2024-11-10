import React from "react";
import ArticlesTable from "main/components/Articles/ArticlesTable";
import { articlesFixtures } from "fixtures/articlesFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";

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
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsOrdinaryUser = Template.bind({});
ThreeItemsOrdinaryUser.args = {
  articles: articlesFixtures.threeArticles,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
  articles: articlesFixtures.threeArticles,
  currentUser: currentUserFixtures.adminUser,
};
