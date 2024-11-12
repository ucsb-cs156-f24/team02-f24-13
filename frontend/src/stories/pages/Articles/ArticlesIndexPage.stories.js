import React from "react";
import ArticlesIndexPage from "main/pages/Articles/ArticlesIndexPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { articlesFixtures } from "fixtures/articlesFixtures"; // Assuming you have this fixture
import { http, HttpResponse } from "msw";

export default {
  title: "pages/Articles/ArticlesIndexPage",
  component: ArticlesIndexPage,
};

const Template = () => <ArticlesIndexPage storybook={true} />;

export const Empty = Template.bind({});
Empty.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.userOnly, {
        status: 200,
      });
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither, {
        status: 200,
      });
    }),
    http.get("/api/articles/all", () => {
      return HttpResponse.json([], { status: 200 });
    }),
  ],
};

export const ThreeItemsRegularUser = Template.bind({});
ThreeItemsRegularUser.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.userOnly, {
        status: 200,
      });
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither, {
        status: 200,
      });
    }),
    http.get("/api/articles/all", () => {
      return HttpResponse.json(articlesFixtures.threeArticles, { status: 200 });
    }),
  ],
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.adminUser, {
        status: 200,
      });
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither, {
        status: 200,
      });
    }),
    http.get("/api/articles/all", () => {
      return HttpResponse.json(articlesFixtures.threeArticles, { status: 200 });
    }),
    http.delete("/api/articles", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};
