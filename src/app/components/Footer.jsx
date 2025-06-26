import React from "react";
import Image from "next/image";
import Logo from "../../assets/Vlogo.d83a8feb5370b0b7c52a.png";

export default function Footer() {
  return (
    <footer className="w-full flex flex-col gap-10 md:px-20 px-10 pt-10 pb-5 bg-[#0A192F] border-t border-slate-700
        shadow-inner shadow-slate-800 text-white">
      {/* Top Section */}
      <div className="grid md:grid-cols-3 gap-10">
        {/* Logo & Contact Info */}
        <div className="flex flex-col gap-4">
          <Image src={Logo} alt="AMURoboclub Logo" className="w-40" />
          <p className="text-lg text-gray-300">
            Where Innovation Meets Implementation
          </p>
          <p className="text-sm">📍 AMU, Aligarh</p>
          <p className="text-sm"><a href="mailto:amuroboclub@gmail.com" className="text-sm hover:underline">
  📧 amuroboclub@gmail.com
</a></p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="font-semibold mb-3 text-lg">Quick Links</h3>
          <div className="flex flex-col gap-2 text-sm">
            <a href="/contactus" className="hover:underline">About Us</a>
            <a href="/projects" className="hover:underline">Projects</a>
            <a href="/team" className="hover:underline">Team</a>
            <a href="/events" className="hover:underline">Events</a>
          </div>
        </div>

        {/* Google Map */}
        <div>
          <h3 className="font-semibold mb-3 text-lg">Our Location</h3>
          <div className="rounded-lg overflow-hidden w-full h-48 md:h-40">
            <iframe
              className="w-full h-full"
              frameBorder="0"
              src="https://www.google.com/maps/embed/v1/place?q=amu+roboclub&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Contact Button and Socials */}
      <div className="flex md:flex-row flex-col items-center justify-between border-t border-gray-600 pt-6">
        {/* Contact Button */}
        <a className="h-[2.7rem] mb-4 md:mb-0 flex items-center gap-5 border-2 border-white hover:bg-white hover:text-mainblue transition-colors duration-200 px-5 py-1 cursor-pointer rounded-full font-medium text-[1rem]">
          Contact
        </a>

        {/* Social Icons */}
        <div className="flex items-center gap-5">
          <a href="https://www.linkedin.com/company/amuroboclub/?lipi=urn%3Ali%3Apage%3Ad_flagship3_search_srp_all%3BGvhzPw1ES5CjysMwoTzrWA%3D%3D" target="_blank" rel="noopener noreferrer" className="hover:bg-white transition-all duration-200 hover:rounded-full p-2 group">
          <svg className="w-6 h-6 fill-current group-hover:fill-mainblue" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path d="M100.28 448H7.4V148.9h92.88zm-46.44-341a53.41 53.41 0 1 1 53.4-53.4 53.4 53.4 0 0 1-53.4 53.4zM447.9 448h-92.4V302.4c0-34.7-12.4-58.4-43.3-58.4-23.6 0-37.6 15.8-43.8 31V448h-92.6s1.2-270.8 0-298.9h92.6v42.4c12.3-19 34.2-46.1 83.4-46.1 60.8 0 106.4 39.7 106.4 125.1z" />


              <title>LinkedIn</title>
            </svg>
          </a>
          <a href="https://www.instagram.com/amuroboclub?igsh=eWtoeGIzOXFvZW5u" target="_blank" rel="noopener noreferrer" className="hover:bg-white transition-all duration-200 hover:rounded-full p-2 group">
            <svg className="w-6 h-6 fill-current group-hover:fill-mainblue" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9 114.9-51.3 114.9-114.9-51.3-114.9-114.9-114.9zm0 189.6c-41.2 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8s-26.8-12-26.8-26.8 12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9s-58-34.4-93.9-36.2C293.7 32 256 32 224 32s-69.7 0-92.5 1.4c-35.9 1.7-67.7 9.9-93.9 36.2s-34.4 58-36.2 93.9C0 186.3 0 224 0 256s0 69.7 1.4 92.5c1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c22.8 1.4 60.5 1.4 92.5 1.4s69.7 0 92.5-1.4c35.9-1.7 67.7-9.9 93.9-36.2s34.4-58 36.2-93.9c1.4-22.8 1.4-60.5 1.4-92.5s0-69.7-1.4-92.5zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />


              <title>Instagram</title>
            </svg>
          </a>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center text-xs text-gray-400 mt-4">
        &copy; 2025 AMURoboclub | Web Development Team
      </div>
    </footer>
  );
}
