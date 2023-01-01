import Service from "./Service";
import { Container } from "react-bootstrap";
import styles from "./OtherServices.module.css";
import { useTranslation } from "next-i18next";

const OtherServices = () => {
  const { t } = useTranslation("common");

  const data = [
    {
      id: 1,
      icon: "/images/home/icons/icon6.webp",
      title: t("home-who-can-use-data-students-title"),
      description: t("home-who-can-use-data-students-subtitle"),
    },
    {
      id: 2,
      icon: "/images/home/icons/icon4.webp",
      title: t("home-who-can-use-data-companies-title"),
      description: t("home-who-can-use-data-companies-subtitle"),
    },
    {
      id: 3,
      icon: "/images/home/icons/icon1.webp",
      title: t("home-who-can-use-data-workers-title"),
      description: t("home-who-can-use-data-workers-subtitle"),
    },
    {
      id: 4,
      icon: "/images/home/icons/icon5.webp",
      title: t("home-who-can-use-data-events-title"),
      description: t("home-who-can-use-data-events-subtitle"),
    },
    {
      id: 5,
      icon: "/images/home/icons/icon3.webp",
      title: t("home-who-can-use-data-trips-title"),
      description: t("home-who-can-use-data-trips-subtitle"),
    },
    {
      id: 6,
      icon: "/images/home/icons/icon2.webp",
      title: t("home-who-can-use-data-tourists-title"),
      description: t("home-who-can-use-data-tourists-subtitle"),
    },
  ];

  return (
    <section id="who-can-use" className={styles.section}>
      <Container>
        <div className={styles.heading}>
          <h2>{t("home-who-can-use-title")}</h2>
          <p>{t("home-who-can-use-subtitle")}</p>
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
export default OtherServices;
