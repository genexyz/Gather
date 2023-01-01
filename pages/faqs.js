import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useState } from "react";
import { Container } from "react-bootstrap";
import styles from "./faqs.module.css";
import FAQ from "../components/FAQ";
import Head from "next/head";
import { useTranslation } from "next-i18next";

export default function Faqs() {
  const { t } = useTranslation("common");

  // Questions about the Gather app
  const [faqsApp, setFaqsApp] = useState({
    title: t("app"),
    questions: [
      {
        question: "faqs-app-1",
        answer: "faqs-app-1-answer",
        open: false,
      },
      {
        question: "faqs-app-2",
        answer: "faqs-app-2-answer",
        open: false,
      },
    ],
  });

  // Questions about trips in Gather
  const [faqsTrips, setFaqsTrips] = useState({
    title: t("trips"),
    questions: [
      {
        question: "faqs-trips-1",
        answer: "faqs-trips-1-answer",
        open: false,
      },
      {
        question: "faqs-trips-2",
        answer: "faqs-trips-2-answer",
        open: false,
      },
      {
        question: "faqs-trips-3",
        answer: "faqs-trips-3-answer",
        open: false,
      },
      {
        question: "faqs-trips-4",
        answer: "faqs-trips-4-answer",
        open: false,
      },
      {
        question: "faqs-trips-5",
        answer: "faqs-trips-5-answer",
        open: false,
      },
    ],
  });

  // Questions about payments in Gather
  const [faqsPayments, setFaqsPayments] = useState({
    title: t("payments"),
    questions: [
      {
        question: "faqs-payments-1",
        answer: "faqs-payments-1-answer",
        open: false,
      },
      {
        question: "faqs-payments-2",
        answer: "faqs-payments-2-answer",
        open: false,
      },
      {
        question: "faqs-payments-3",
        answer: "faqs-payments-3-answer",
        open: false,
      },
      {
        question: "faqs-payments-4",
        answer: "faqs-payments-4-answer",
        open: false,
      },
    ],
  });

  // Questions about the privacy policy
  const [faqsPrivacy, setFaqsPrivacy] = useState({
    title: t("privacy"),
    questions: [
      {
        question: "faqs-privacy-1",
        answer: "faqs-privacy-1-answer",
        open: false,
      },
      {
        question: "faqs-privacy-2",
        answer: "faqs-privacy-2-answer",
        open: false,
      },
      {
        question: "faqs-privacy-3",
        answer: "faqs-privacy-3-answer",
        open: false,
      },
    ],
  });

  // Questions about the terms of service
  const [faqsTerms, setFaqsTerms] = useState({
    title: t("terms"),
    questions: [
      {
        question: "faqs-terms-1",
        answer: "faqs-terms-1-answer",
        open: false,
      },
      {
        question: "faqs-terms-2",
        answer: "faqs-terms-2-answer",
        open: false,
      },
      {
        question: "faqs-terms-3",
        answer: "faqs-terms-3-answer",
        open: false,
      },
    ],
  });

  const toggleFAQ = (index, section) => {
    if (section === faqsApp.title) {
      setFaqsApp({
        ...faqsApp,
        questions: faqsApp.questions.map((question, i) => {
          if (i === index) {
            question.open = !question.open;
          } else {
            question.open = false;
          }

          return question;
        }),
      });
    } else if (section === faqsTrips.title) {
      setFaqsTrips({
        ...faqsTrips,
        questions: faqsTrips.questions.map((question, i) => {
          if (i === index) {
            question.open = !question.open;
          } else {
            question.open = false;
          }

          return question;
        }),
      });
    } else if (section === faqsPayments.title) {
      setFaqsPayments({
        ...faqsPayments,
        questions: faqsPayments.questions.map((question, i) => {
          if (i === index) {
            question.open = !question.open;
          } else {
            question.open = false;
          }

          return question;
        }),
      });
    } else if (section === faqsPrivacy.title) {
      setFaqsPrivacy({
        ...faqsPrivacy,
        questions: faqsPrivacy.questions.map((question, i) => {
          if (i === index) {
            question.open = !question.open;
          } else {
            question.open = false;
          }

          return question;
        }),
      });
    } else if (section === faqsTerms.title) {
      setFaqsTerms({
        ...faqsTerms,
        questions: faqsTerms.questions.map((question, i) => {
          if (i === index) {
            question.open = !question.open;
          } else {
            question.open = false;
          }

          return question;
        }),
      });
    }
  };

  return (
    <>
      <Head>
        <title>Gather - FAQs</title>
        <meta name="description" content="Frequently Asked Questions about Gather." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container className={styles.container}>
        <aside className={styles.questionsSidebar}>
          <h2>FAQs</h2>
          <ul>
            <li>
              <a href="#app">{t("app")}</a>
            </li>
            <li>
              <a href="#trips">{t("trips")}</a>
            </li>
            <li>
              <a href="#payments">{t("payments")}</a>
            </li>
            <li>
              <a href="#privacy">{t("privacy")}</a>
            </li>
            <li>
              <a href="#terms">{t("terms")}</a>
            </li>
          </ul>
        </aside>

        <div className={styles.faqs}>
          <div className={styles.faqGroup}>
            <h2 id="app" className={styles.faqGroupTitle}>
              {t("app")}
            </h2>
            {faqsApp.questions.map((faq, i) => (
              <FAQ
                faq={faq}
                index={i}
                key={i}
                toggleFAQ={() => toggleFAQ(i, faqsApp.title)}
              />
            ))}
          </div>

          <div className={styles.faqGroup}>
            <h2 id="trips" className={styles.faqGroupTitle}>
              {t("trips")}
            </h2>
            {faqsTrips.questions.map((faq, i) => (
              <FAQ
                faq={faq}
                index={i}
                key={i}
                toggleFAQ={() => toggleFAQ(i, faqsTrips.title)}
              />
            ))}
          </div>

          <div className={styles.faqGroup}>
            <h2 id="payments" className={styles.faqGroupTitle}>
              {t("payments")}
            </h2>
            {faqsPayments.questions.map((faq, i) => (
              <FAQ
                faq={faq}
                index={i}
                key={i}
                toggleFAQ={() => toggleFAQ(i, faqsPayments.title)}
              />
            ))}
          </div>

          <div className={styles.faqGroup}>
            <h2 id="privacy" className={styles.faqGroupTitle}>
              {t("privacy")}
            </h2>
            {faqsPrivacy.questions.map((faq, i) => (
              <FAQ
                faq={faq}
                index={i + 6}
                key={i + 6}
                toggleFAQ={() => toggleFAQ(i, faqsPrivacy.title)}
              />
            ))}
          </div>

          <div className={styles.faqGroup}>
            <h2 id="terms" className={styles.faqGroupTitle}>
              {t("terms")}
            </h2>
            {faqsTerms.questions.map((faq, i) => (
              <FAQ
                faq={faq}
                index={i + 6}
                key={i + 6}
                toggleFAQ={() => toggleFAQ(i, faqsTerms.title)}
              />
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: { ...(await serverSideTranslations(locale, ["common"])) },
  };
}
