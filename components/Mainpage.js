import React from "react";
import Banner from "./home/Banner";
import Services from "./home/Services";
import OurTeam from "./home/OurTeam";
import OtherServices from "./home/OtherServices";
import Feedback from "./home/Feedback";

export default function Mainpage() {
  return (
    <>
      <Banner />
      <Services />
      <OurTeam />
      <OtherServices />
      <Feedback />
    </>
  );
}
