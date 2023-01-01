import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Button, Container, Modal, Row, Form } from "react-bootstrap";
import { Rating } from "@mui/material";
import styles from "./TripModals.module.css";

const TripReviewModal = (props) => {
  const { t } = useTranslation("common");
  const [errors, setErrors] = useState({});
  const [review, setReview] = useState({
    title: "",
    description: "",
    rating: null,
  });

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setReview((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (!!errors[name])
      setErrors({
        ...errors,
        [name]: null,
      });
  };

  const handleClose = () => {
    setReview({
      title: "",
      description: "",
      rating: null,
    });
    setErrors({});
    props.handleClose();
  };

  const findFormErrors = () => {
    let { title, description, rating } = review;

    const newErrors = {};

    if (!rating || rating === 0) newErrors.rating = t("cannot-be-0");
    if (!title || title === "") newErrors.title = t("cannot-be-blank");
    if (!description || description === "") newErrors.description = t("cannot-be-blank");
    return newErrors;
  };

  const submitData = async (e) => {
    e.preventDefault();
    const newErrors = findFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      try {
        const body = {
          ...review,
          tripId: props.tripId,
          reviewerId: props.reviewerId,
          userId: props.driver.id,
        };
        const response = await fetch("/api/trip/review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (response.status === 200) {
          handleClose();
          props.refresh();
          props.handleNotification("success", "", t("driver-reviewed"));
        }
        if (response.status === 400) {
          const data = await response.json();
          console.log(data);
          props.handleNotification("error", "", t("couldnt-review-driver"));
        }
        if (response.status === 401) {
          handleClose();
          props.handleNotification("error", "", t("not-authorized"));
        }
        if (response.status === 500) {
          handleClose();
          props.handleNotification("error", "", t("server-error"));
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    }
  };

  return (
    <Modal show={props.show} onHide={handleClose} size="md">
      <Modal.Header closeButton>
        <Modal.Title>
          {t("review-driver")} - {props.driver.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Form.Group className="mb-3" controlId="formReviewTitle">
              <Form.Label>{t("review-title")}</Form.Label>
              <Form.Control
                type="text"
                value={review.title}
                name="title"
                onChange={onInputChange}
                isInvalid={!!errors.title}
              />
              <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group className="mb-3" controlId="formReviewDescription">
              <Form.Label>{t("review-description")}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={review.description}
                name="description"
                onChange={onInputChange}
                isInvalid={!!errors.description}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              className={`mb-3 ${styles.ratingDiv}`}
              controlId="formReviewRating"
            >
              <Rating
                name="simple-controlled"
                value={review.rating}
                onChange={(event, newValue) => {
                  setReview({
                    ...review,
                    rating: newValue,
                  });
                  if (!!errors["rating"])
                    setErrors({
                      ...errors,
                      ["rating"]: null,
                    });
                }}
                className={styles.stars}
              />
              <div className={`${errors.rating ? styles.invalid : ""} invalid-feedback`}>
                {errors.rating}
              </div>
            </Form.Group>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {t("cancel")}
        </Button>
        <Button variant="success" onClick={submitData}>
          {t("review")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TripReviewModal;
