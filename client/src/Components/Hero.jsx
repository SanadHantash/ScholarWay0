import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import heroimg from "../Assets/hero.jpg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Hero() {



  return (
    <div class="relative flex flex-col items-center max-w-screen-xl px-4 mx-auto md:flex-row sm:px-6 p-8">
    <div class="flex items-center py-5 md:w-1/2 md:pb-20 md:pt-10 md:pr-10">
        <div class="text-left">
            <h2
                class="text-4xl font-extrabold leading-10 tracking-tight text-gray-800 sm:text-5xl sm:leading-none md:text-6xl">
                Scholar
                <span class="font-bold text-[#365E32]">Way</span>
            </h2>
            <p class="max-w-md mx-auto mt-3 text-base text-[#81A263] sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Your Academic Portal to Success. Accessing top-quality online courses has never been simpler. We connect learners with expert educators, providing a seamless and enriching educational experience.
            </p>
            
        </div>
    </div>
    <div class="flex items-center py-5 md:w-1/2 md:pb-20 md:pt-10 md:pl-10">
        <div class="relative w-full p-3 rounded  md:p-8">
            <div class="rounded-lg bg-white text-black w-full">
                <img src={heroimg} />
            </div>
        </div>
    </div>
</div>
  );
}

export default Hero;
