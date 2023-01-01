import { Container } from "react-bootstrap";
import Service from "./Service";
import styles from "./Services.module.css";
import { useTranslation } from "next-i18next";

const Services = () => {
  const { t } = useTranslation("common");

  const data = [
    {
      id: 1,
      icon: "/images/home/icons/service6.webp",
      title: t("home-services-data-environment-title"),
      description: t("home-services-data-environment-subtitle"),
    },
    {
      id: 2,
      icon: "/images/home/icons/service4.webp",
      title: t("home-services-data-community-title"),
      description: t("home-services-data-community-subtitle"),
    },
    {
      id: 3,
      icon: "/images/home/icons/service2.webp",
      title: t("home-services-data-schedule-title"),
      description: t("home-services-data-schedule-subtitle"),
    },
  ];

  return (
    <section id="services" className={styles.section}>
      <Container>
        <div className={styles.heading}>
          <h2>{t("home-services-title")}</h2>
          <p>{t("home-services-subtitle")}</p>
        </div>
        <div className={styles.contentWrapper}>
          {data?.map((item) => (
            <Service key={item.id} item={item} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Services;
