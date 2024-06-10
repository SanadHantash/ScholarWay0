import React from "react";
import about from "../Assets/contactus.jpg";
function About() {
  return (
    <>
      <section class="bg-gradient-to-r from-[#799351] to-[#A1DD70] mb-5">
        <div class="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
            <div class="max-w-lg">
              <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                About Us
              </h2>
              <p class="mt-4 text-gray-600 text-xl font-bold">
                Welcome to ScholarWay, your premier destination for quality
                online education. We offer a diverse range of courses across
                various disciplines, featuring professionally produced video
                lectures from industry experts and academic professionals. Our
                mission is to make learning accessible and engaging for
                everyone, allowing you to study at your own pace and join a
                vibrant community of learners worldwide. With ScholarWay,
                empower yourself with knowledge and reach your full potential.
              </p>
            </div>
            <div class="mt-12 md:mt-0">
              <img
                src={about}
                alt="About Us Image"
                class="object-cover rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
