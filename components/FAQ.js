import React from "react";
import styles from "./FAQ.module.css";
import { useTranslation } from "next-i18next";

export default function FAQ({ faq, index, toggleFAQ }) {
  const { t } = useTranslation("common");
  return (
    <div
      className={`${styles.faq} ${faq.open ? styles.open : ""}`}
      key={index}
      onClick={() => toggleFAQ(index)}
    >
      <div className={styles.faqQuestion}>{t(faq.question)}</div>
      <div className={styles.faqAnswer}>{t(faq.answer)}</div>
    </div>
  );
}
