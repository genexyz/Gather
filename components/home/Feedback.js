import styles from "./Feedback.module.css";
import Link from "next/link";
import { Row, Col, Container, Button } from "react-bootstrap";
import { useTranslation } from "next-i18next";

const Feedback = () => {
  const { t } = useTranslation("common");

  return (
    <section className={styles.section}>
      <Container>
        <Row className={styles.contentWrapper}>
          <Col lg={8}>
            <div className={styles.heading}>
              <h2>{t("home-feedback-title")}</h2>
              <p>{t("home-feedback-subtitle")}</p>
              <p>{t("home-feedback-subtitle2")}</p>
            </div>
          </Col>
          <Col lg={4} className={styles.contactCol}>
            <div className={styles.heading}>
              <h2> {t("home-feedback-contact-us")} </h2>
            </div>
            <Link href="mailto:contact@gathertrips.com" passHref>
              <Button variant="success" className={styles.btn}>
                {t("home-feedback-button")}
              </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Feedback;
