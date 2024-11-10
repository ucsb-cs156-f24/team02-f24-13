import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import ArticlesForm from "main/components/Articles/ArticlesForm";
import { Navigate } from "react-router-dom";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function ArticlesEditPage({ storybook = false }) {
  let { id } = useParams();

  const {
    data: article,
    error: _error,
    status: _status,
  } = useBackend([`/api/articles?id=${id}`], {
    method: "GET",
    url: `/api/articles`,
    params: {
      id,
    },
  });

  const objectToAxiosPutParams = (article) => ({
    url: "/api/articles",
    method: "PUT",
    params: {
      id: article.id,
    },
    data: {
      title: article.title,
      url: article.url,
      explanation: article.explanation,
      email: article.email,
      dateAdded: article.dateAdded,
    },
  });

  const onSuccess = (article) => {
    toast(`Article Updated - id: ${article.id} title: ${article.title}`);
  };

  const mutation = useBackendMutation(objectToAxiosPutParams, { onSuccess }, [
    `/api/articles?id=${id}`,
  ]);

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/articles" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Article</h1>
        {article && (
          <ArticlesForm
            initialContents={article}
            submitAction={onSubmit}
            buttonLabel="Update"
          />
        )}
      </div>
    </BasicLayout>
  );
}
