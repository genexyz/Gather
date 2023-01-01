import Image from "next/image";
import Link from "next/link";
import styles from "./TeamMember.module.css";
import { FaTwitter, FaGithub, FaDribbble } from "react-icons/fa";

const TeamMember = ({ member }) => {
  return (
    <div className={styles.section}>
      <figure className={styles.avatar}>
        <Image src={member?.avatar} alt={member?.name} width={350} height={385} />
      </figure>
      <div className={styles.about}>
        <h3>{member?.name}</h3>
        <p>{member?.designation}</p>
        <div className={styles.socialLinks}>
          {member?.socialLinks?.map((social, index) => (
            <Link href={social?.link} key={index} aria-label={`Link to ${social?.name}`}>
              {social?.name === "twitter" && <FaTwitter size="18px" color="#55ACEE" />}
              {social?.name === "github" && <FaGithub size="18px" color="#161614" />}
              {social?.name === "dribbble" && (
                <FaDribbble
                  size="18px"
                  color="#B2215A"
                  style={{ backgroundColor: "#E74D89", borderRadius: 20 }}
                />
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamMember;
