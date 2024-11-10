import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

export default function ArticlesIndexPage() {
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Index page not yet implemented</h1>
        <p>
          <a href="/articles/create">Create</a>
        </p>
        <p>
          <a href="/articles/edit/1">Edit</a>
        </p>
      </div>
    </BasicLayout>
  );
}