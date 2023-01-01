import { useRef, useState } from "react";
import Image from "next/image";
import SwiperCore, { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import TeamMember from "./TeamMember";
import { Container } from "react-bootstrap";
import styles from "./OurTeam.module.css";
import { useTranslation } from "next-i18next";

SwiperCore.use([Navigation, Pagination]);

const data = [
  {
    id: 1,
    avatar: "/images/home/team/member3.webp",
    name: "Edward Webb",
    designation: "Lead developer",
    socialLinks: [
      {
        name: "twitter",
        link: "https://twitter.com",
      },
      {
        name: "github",
        link: "https://github.com",
      },
      {
        name: "dribbble",
        link: "https://dribbble.com",
      },
    ],
  },
  {
    id: 2,
    avatar: "/images/home/team/member1.webp",
    name: "Alexis Freeman",
    designation: "Analyst",
    socialLinks: [
      {
        name: "twitter",
        link: "https://twitter.com",
      },
      {
        name: "github",
        link: "https://github.com",
      },
      {
        name: "dribbble",
        link: "https://dribbble.com",
      },
    ],
  },
  {
    id: 3,
    avatar: "/images/home/team/member2.webp",
    name: "Daisy Morgan",
    designation: "Product designer",
    socialLinks: [
      {
        name: "twitter",
        link: "https://twitter.com",
      },
      {
        name: "github",
        link: "https://github.com",
      },
      {
        name: "dribbble",
        link: "https://dribbble.com",
      },
    ],
  },
  {
    id: 4,
    avatar: "/images/home/team/member4.webp",
    name: "Yamilet Hooker",
    designation: "User interface designer",
    socialLinks: [
      {
        name: "twitter",
        link: "https://twitter.com",
      },
      {
        name: "github",
        link: "https://github.com",
      },
      {
        name: "dribbble",
        link: "https://dribbble.com",
      },
    ],
  },
  {
    id: 5,
    avatar: "/images/home/team/member1.webp",
    name: "Montgomery Myron",
    designation: "Frontend Developer",
    socialLinks: [
      {
        name: "twitter",
        link: "https://twitter.com",
      },
      {
        name: "github",
        link: "https://github.com",
      },
      {
        name: "dribbble",
        link: "https://dribbble.com",
      },
    ],
  },
  {
    id: 6,
    avatar: "/images/home/team/member2.webp",
    name: "Stephani Rosemary",
    designation: "Backend developer",
    socialLinks: [
      {
        name: "twitter",
        link: "https://twitter.com",
      },
      {
        name: "github",
        link: "https://github.com",
      },
    ],
  },
  {
    id: 7,
    avatar: "/images/home/team/member3.webp",
    name: "Dustin Dave",
    designation: "Customer Service",
    socialLinks: [
      {
        name: "twitter",
        link: "https://twitter.com",
      },
    ],
  },
  {
    id: 8,
    avatar: "/images/home/team/member4.webp",
    name: "Emma Elissa",
    designation: "Dev Ops Engineer",
    socialLinks: [
      {
        name: "twitter",
        link: "https://twitter.com",
      },
      {
        name: "github",
        link: "https://github.com",
      },
    ],
  },
];

const OurTeam = () => {
  const swiperRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { t } = useTranslation("common");

  const isEnd = swiperRef?.current?.swiper?.isEnd;

  const handlePrev = () => {
    swiperRef?.current?.swiper?.slidePrev();
    setInterval(() => {
      setCurrentIndex(swiperRef?.current?.swiper?.activeIndex);
    }, 100);

    clearInterval();
  };
  const handleNext = () => {
    swiperRef?.current?.swiper?.slideNext();
    setInterval(() => {
      setCurrentIndex(swiperRef?.current?.swiper?.activeIndex);
    }, 100);

    clearInterval();
  };

  const breakpoints = {
    0: {
      slidesPerView: 1,
      spaceBetween: 0,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
    992: {
      slidesPerView: 4,
      spaceBetween: 30,
    },
    1400: {
      slidesPerView: 5,
      spaceBetween: 30,
    },
  };

  return (
    <section id="team" className={styles.section}>
      <Container>
        <div className={styles.heading}>
          <h2>{t("home-team-title")}</h2>
          <p>{t("home-team-subtitle")}</p>
        </div>
      </Container>
      <div className={styles.teamWrapper}>
        {currentIndex !== 0 && (
          <button
            onClick={handlePrev}
            className={`${styles.swiperArrow} ${styles.swiperArrowLeft}`}
          >
            <Image
              src="/images/home/icons/arrow-right.webp"
              alt="Arrow Left"
              width={14}
              height={18}
            />
          </button>
        )}
        {!isEnd && (
          <button
            className={`${styles.swiperArrow} ${styles.swiperArrowRight}`}
            onClick={handleNext}
          >
            <Image
              src="/images/home/icons/arrow-right.webp"
              alt="Arrow Right"
              width={14}
              height={18}
            />
          </button>
        )}

        <Swiper
          ref={swiperRef}
          spaceBetween={30}
          slidesPerView={5}
          breakpoints={breakpoints}
        >
          {data?.map((item) => (
            <SwiperSlide key={item.id}>
              <TeamMember member={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default OurTeam;
