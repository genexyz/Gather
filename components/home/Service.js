import Image from "next/image";
import styles from "./Service.module.css";

const Service = ({ item }) => {
  return (
    <div className={styles.serviceItem}>
      <figure className={styles.figure}>
        <Image
          src={item?.icon}
          alt={`Service Icon - ${item?.title}`}
          width={88}
          height={88}
        />
      </figure>
      <div className={styles.content}>
        <h3>{item?.title}</h3>
        <p>{item?.description}</p>
      </div>
    </div>
  );
};

export default Service;
