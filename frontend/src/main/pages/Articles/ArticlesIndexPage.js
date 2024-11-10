import React from "react";
import { useBackend } from "main/utils/useBackend";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import ArticlesTable from "main/components/Articles/ArticlesTable";
import { Button } from "react-bootstrap";
import { useCurrentUser, hasRole } from "main/utils/currentUser";

export default function ArticlesIndexPage() {
  const currentUser = useCurrentUser();

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
      return (
        <Button
          variant="primary"
          href="/articles/create"
          style={{ float: "right" }}
          data-testid="ArticlesIndexPage-create-button"
        >
          Create Article
        </Button>
      );
    }
  };

  const {
    data: articles,
    error: _error,
    status: _status,
  } = useBackend(
    ["/api/articles/all"],
    { method: "GET", url: "/api/articles/all" },
    [],
  );

  return (
    <BasicLayout>
      <div className="pt-2">
        {createButton()}
        <h1>Articles</h1>
        <ArticlesTable articles={articles} currentUser={currentUser} />
      </div>
    </BasicLayout>
  );
}
