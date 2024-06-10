import React, { useEffect } from "react";

import Hero from "../Components/Hero";

import Cards from "../Components/Cards";
 
import About from "../Components/About";
function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
    <></>;
  }, []);
  return (
    <div>
      <Hero />
      <Cards />
     <About />
    </div>
  );
}

export default Home;
