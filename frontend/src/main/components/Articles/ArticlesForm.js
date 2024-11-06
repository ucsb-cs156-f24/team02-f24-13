import React from "react";
import { useForm } from "react-hook-form";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function ArticlesForm({
  initialContents,
  submitAction,
  buttonLabel = "Create",
  dateInputType = "datetime-local",
}) {
  const navigate = useNavigate();

  // Regular expressions for validation
  const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
  const url_regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

  // Stryker disable Regex
  const isodate_regex =
    /^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d(:[0-5]\d(\.\d+)?)?)$/i;
  // Stryker restore

  // Set up form handling
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: initialContents || {},
  });

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      {initialContents && (
        <Form.Group className="mb-3" controlId="ArticlesForm-id">
          <Form.Label>Id</Form.Label>
          <Form.Control
            data-testid="ArticlesForm-id"
            type="text"
            {...register("id")}
            value={initialContents.id}
            disabled
          />
        </Form.Group>
      )}

      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="ArticlesForm-title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              data-testid="ArticlesForm-title"
              type="text"
              isInvalid={Boolean(errors.title)}
              {...register("title", {
                required: "Title is required.",
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.title?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="ArticlesForm-url">
            <Form.Label>URL</Form.Label>
            <Form.Control
              data-testid="ArticlesForm-url"
              type="text"
              isInvalid={Boolean(errors.url)}
              {...register("url", {
                required: "URL is required.",
                pattern: {
                  value: url_regex,
                  message: "Please enter a valid URL.",
                },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.url?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3" controlId="ArticlesForm-explanation">
        <Form.Label>Explanation</Form.Label>
        <Form.Control
          data-testid="ArticlesForm-explanation"
          as="textarea"
          rows={3}
          isInvalid={Boolean(errors.explanation)}
          {...register("explanation", {
            required: "Explanation is required.",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.explanation?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="ArticlesForm-email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              data-testid="ArticlesForm-email"
              type="email"
              isInvalid={Boolean(errors.email)}
              {...register("email", {
                required: "Email is required.",
                pattern: {
                  value: email_regex,
                  message: "Please enter a valid email address.",
                },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="ArticlesForm-dateAdded">
            <Form.Label>Date Added</Form.Label>
            <Form.Control
              data-testid="ArticlesForm-dateAdded"
              type={dateInputType}
              isInvalid={Boolean(errors.dateAdded)}
              {...register("dateAdded", {
                required: "Date Added is required.",
                pattern: {
                  value: isodate_regex,
                  message: "Please enter a valid date and time.",
                },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.dateAdded?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Button variant="primary" type="submit" data-testid="ArticlesForm-submit">
        {buttonLabel}
      </Button>
      <Button
        variant="secondary"
        onClick={() => navigate(-1)}
        data-testid="ArticlesForm-cancel"
      >
        Cancel
      </Button>
    </Form>
  );
}

export default ArticlesForm;
