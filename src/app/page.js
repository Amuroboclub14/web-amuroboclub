import Image from "next/image";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import team from "../assets/IMG_1559.webp";
import cord from "../assets/coords.webp";
import group from "../assets/IMG_2739.webp";
import amusat from "../assets/ssamusat.jpeg";
import AnimatedSVG from "./components/AnimatedSvg";
import * as motion from "framer-motion/client";
import Faqs from "./components/Faqs";
export default function Home() {
  return (
    <main>
      <Navbar bgColor={"mainlight"} />
      <div className="flex md:flex-row flex-col items-center justify-between gap-[5rem] md:gap-[2rem] md:pl-5  py-[3rem] bg-mainlight overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.3 }}
          className="md:w-[45%] flex flex-col gap-10 px-5"
        >
          <h1 className="text-[2.6rem] leading-[2.5rem] md:leading-[4rem] md:text-[3.5rem] font-bold font-mont text-left text-mainblue md:pt-[12vh]">
            To create a better future, you need an AV system that imagines{" "}
            <span className="text-gradient">every possibility</span>.
          </h1>
          <p className="text-justify font-mont font-medium text-mainblue/90">
            AMURoboclub nurtures curious minds with its motto, &apos;Where
            Innovation Meets Implementation.&apos; It offers a dynamic learning
            environment and hands-on experience with robotics technologies,
            guided by faculty advisors from Zakir Husain College of Engineering
            and Technology, Aligarh Muslim University.
          </p>

          <div className="w-fit">
            <a
              className="group flex items-center gap-5 border-2 border-green-600 hover:bg-green-600 hover:text-white transition-colors duration-300 px-5 py-3 rounded-full font-bold text-[1.1rem]"
              href="https://drive.google.com/file/d/1RFu5NtxDXvg54ka9GJcrxYiexZaR1wXk/view?usp=sharing"
              target="_blank" // Optional: Opens in a new tab
              rel="noopener noreferrer" // Optional: Security for external links
            >
              Download Our APP
              <span className="flex justify-end w-0 h-4 -ml-2 pointer-events-none overflow-hidden transition-[width] duration-300 group-hover:w-6">
                <svg
                  className="block w-4 h-4 flex-initial pointer-events-none fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 9h-4V2H9v7H5l7 7 7-7zm-7 9H5v2h14v-2h-7z" />
                </svg>
              </span>
            </a>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.3 }}
          className="relative pl-5"
        >
          <div className="w-[90%] h-[30vh] bg-[#379040] rounded-l-[3rem] absolute -top-5 right-0"></div>
          <Image
            src={team}
            alt="team"
            placeholder="blur"
            className="md:w-[40vw] rounded-l-[3rem] relative"
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex md:flex-row flex-col items-start justify-start md:justify-center md:gap-8 px-10 md:px-24 py-20"
      >
        <Image
          src={cord}
          alt="team"
          className="md:z-10 relative md:w-[25vw] w-[60vw] md:rounded-[1rem] rounded-md  -ml-5 shadow-xl"
        />
        <div className="relative md:w-[55%] -mt-10 md:pt-24">
          <div className="bg-lightblue p-5 md:mt-10 md:p-8 md:pl-24 md:-ml-20 rounded bg-brand-gray-light">
            <h1 className="text-[2rem] md:text-[2.8rem] leading-[2rem] md:leading-[3.4rem] font-semibold font-mont text-mainblue">
              What Opportunities Do We{" "}
              <span className="text-gradient">Offer?</span>
            </h1>
            <p className="pt-12 font-mont font-medium text-mainblue/90 text-justify">
              AMURoboclub fosters interest and showcases talent in robotics and
              engineering through engaging activities, competitions, projects,
              and workshops year-round. We encourage participation in national
              and international contests and support students of all branches
              and years. Our experienced seniors and fresh innovators work
              together to provide a training environment that leads to{" "}
              <strong>successful careers</strong>. Our alumni excel in
              prestigious companies and many achieve top ranks in exams like
              GATE, securing positions in IITs for further studies.
            </p>
          </div>
        </div>
      </motion.div>

      {/* What sets us apart */}
      <div className="flex md:flex-row-reverse flex-col items-end md:items-start justify-start md:justify-center md:gap-8 bg-mainlight px-10 md:px-24 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="relative md:z-10"
        >
          <Image
            src={group}
            alt="team"
            className=" md:w-[40vw] w-[90%]  md:rounded-[1rem] rounded-md -mr-5 shadow-xl"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative md:w-[55%] -mt-10 md:pt-24"
        >
          <div className="bg-white p-5 -mt-5 md:mt-10 md:p-8 md:pr-24 md:-mr-20 rounded bg-brand-gray-light">
            <h1 className="text-[2rem] md:text-[2.8rem] leading-[2rem] md:leading-[3.4rem] font-semibold font-mont text-mainblue">
              What Sets Our <br></br>Club{" "}
              <span className="text-gradient">Apart</span>
            </h1>
            <p className="md:pt-12 pt-10 font-mont font-medium text-mainblue/90 text-justify">
              AMURoboclub fosters interest and showcases talent in robotics and
              engineering through engaging activities, competitions, projects,
              and workshops year-round. We encourage participation in national
              and international contests and support students of all branches
              and years. Our experienced seniors and fresh innovators work
              together to provide a training environment that leads to{" "}
              <strong>successful careers</strong>. Our alumni excel in
              prestigious companies and many achieve top ranks in exams like
              GATE, securing positions in IITs for further studies.
            </p>
            <button className="font-medium text-xl border-2 border-blue-500 hover:bg-blue-500 transition hover:text-white px-4 py-2 mt-10 rounded-full">
              Learn More
            </button>
          </div>
        </motion.div>
      </div>
      {/* SSAMUSAT*/}
      <div className="flex md:flex-row-reverse flex-col items-end md:items-start justify-start md:justify-center md:gap-8 bg-mainlight px-10 md:px-24 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="relative md:z-10"
        >
          <Image
            src={amusat}
            alt="team"
            className=" md:w-[40vw] w-[90%]  md:rounded-[1rem] rounded-md -mr-5 shadow-xl"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative md:w-[55%] -mt-10 md:pt-24"
        >
          <div className="bg-white p-5 -mt-5 md:mt-10 md:p-8 md:pr-24 md:-mr-20 rounded bg-brand-gray-light">
            <h1 className="text-[2rem] md:text-[2.8rem] leading-[2rem] md:leading-[3.4rem] font-semibold font-mont text-mainblue">
              <span className="font-bold">SSAMUSAT</span> - AMU&apos;s <br></br>
              <span className="text-gradient">First</span> Satellite Project{" "}
            </h1>
            <p className="md:pt-12 pt-10 font-mont font-medium text-mainblue/90 text-justify">
              The SS AMU SAT project, launched in December 2021 by students and
              alumni of Zakir Husain College of Engineering and Technology, is
              Aligarh Muslim University&apos;s first satellite initiative.
              Inspired by the NAAC committee&apos;s recommendation to innovate
              in Aerial Technology, the project rapidly expanded into
              specialized teams focused on Power, Payload, Control, and
              Communication systems. With guidance from ISRO experts and
              seasoned satellite designers, the team aims for successful
              deployment in Low Earth Orbit, marking a significant milestone in
              AMU&apos;s aerospace research journey.
            </p>
            <div className="mt-10">
              <a
                className="font-medium text-xl border-2 border-blue-500 hover:bg-blue-500 transition hover:text-white px-4 py-2 rounded-full"
                href="https://amu-sat.github.io/"
                target="_blank"
              >
                Learn More
              </a>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="h-fit relative py-10 bg-lightblue">
  <div className="hidden md:block absolute inset-0 w-full h-60 z-0 mt-10">
    <AnimatedSVG />
  </div>
  <div className="flex md:flex-row flex-col justify-center items-center gap-20 md:gap-5">
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="md:w-[40vw] w-[85vw] flex flex-col items-start gap-5 relative p-10 bg-darkblue z-10 rounded-xl hover:shadow-xl hover:bg-white hover:-translate-y-6 transition ease-in-out duration-300 cursor-pointer "
    >
      <div className="absolute -top-5 z-1 w-14 h-14" aria-hidden="true">
        <svg
          className="block w-full h-full fill-blue-600 relative"
          width="48"
          height="58"
          viewBox="0 0 48 58"
          fill="none"
        >
          <path d="M40.9706 7.02944C50.3431 16.402 50.3431 31.598 40.9706 40.9706L25.4142 56.5269C24.6332 57.308 23.3668 57.308 22.5858 56.5269L7.02944 40.9706C-2.34315 31.598 -2.34314 16.402 7.02944 7.02944C16.402 -2.34315 31.598 -2.34314 40.9706 7.02944Z"></path>
        </svg>
        <svg
          className="block w-5 h-fit absolute top-4 left-[1rem] ml-px fill-white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M466.5 83.71l-192-80c-5.875-2.5-12.16-3.703-18.44-3.703S243.5 1.203 237.6 3.703L45.61 83.71C27.73 91.08 16 108.6 16 127.1C16 385.4 205.4 512 255.9 512C305.2 512 496 387.3 496 127.1C496 108.6 484.3 91.08 466.5 83.71zM256 464C158.5 423.4 64 297.3 64 128l192-80L448 128C448 301.8 349.6 425 256 464zM200.1 247C196.3 242.3 190.1 239.1 184 239.1c-13.71 0-24 11.21-24 24C160 270.1 162.3 276.3 167 280.1l48 48C219.5 333.5 225.7 335.1 232 335.1c2.595 0 11.46-.4962 18.22-8.375l96-112c3.881-4.528 5.781-10.09 5.781-15.62c0-7.405-5.79-23.99-23.98-23.99c-6.756 0-13.48 2.831-18.24 8.362L230.7 276.7L200.1 247z"></path>
        </svg>
      </div>
      <h1 className="text-2xl md:text-3xl leading-[2rem] md:leading-[3.4rem] font-semibold font-mont text-mainblue">
        Innovating the Future of Robotics
      </h1>
      <p className="text-lg line-clamp-5">
        At AMURoboclub, innovation and teamwork are at the heart of everything
        we do. Our cutting-edge robotics projects bring together students from
        diverse backgrounds to explore, design, and build automated systems that
        solve real-world problems. By combining advanced sensor technologies and
        collaborative decision-making algorithms, we ensure that our creations
        are reliable, efficient, and impactful.
      </p>
      <a className="text-lg font-medium hover:text-blue-700">Learn More</a>
    </motion.div>
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="md:w-[40vw] w-[85vw] flex flex-col items-start gap-5 relative p-10 bg-darkblue z-10 rounded-xl hover:shadow-xl hover:bg-white hover:-translate-y-6 transition ease-in-out duration-300 cursor-pointer"
    >
      <div className="absolute -top-5 z-1 w-14 h-14" aria-hidden="true">
        <svg
          className="block w-full h-full fill-red-800"
          width="48"
          height="58"
          viewBox="0 0 48 58"
          fill="none"
        >
          <path d="M40.9706 7.02944C50.3431 16.402 50.3431 31.598 40.9706 40.9706L25.4142 56.5269C24.6332 57.308 23.3668 57.308 22.5858 56.5269L7.02944 40.9706C-2.34315 31.598 -2.34314 16.402 7.02944 7.02944C16.402 -2.34315 31.598 -2.34314 40.9706 7.02944Z"></path>
        </svg>
        <svg
          className="block w-5 h-fit absolute top-4 left-[1rem] ml-px fill-white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path d="M423.9 255.8L411 413.1c-3.3 40.7-63.9 35.1-60.6-4.9l10-122.5-41.1 2.3c10.1 20.7 15.8 43.9 15.8 68.5 0 41.2-16.1 78.7-42.3 106.5l-39.3-39.3c57.9-63.7 13.1-167.2-74-167.2-25.9 0-49.5 9.9-67.2 26L73 243.2c22-20.7 50.1-35.1 81.4-40.2l75.3-85.7-42.6-24.8-51.6 46c-30 26.8-70.6-18.5-40.5-45.4l68-60.7c9.8-8.8 24.1-10.2 35.5-3.6 0 0 139.3 80.9 139.5 81.1 16.2 10.1 20.7 36 6.1 52.6L285.7 229l106.1-5.9c18.5-1.1 33.6 14.4 32.1 32.7zm-64.9-154c28.1 0 50.9-22.8 50.9-50.9C409.9 22.8 387.1 0 359 0c-28.1 0-50.9 22.8-50.9 50.9 0 28.1 22.8 50.9 50.9 50.9zM179.6 456.5c-80.6 0-127.4-90.6-82.7-156.1l-39.7-39.7C36.4 342.3 16 382 16 426.5 16 456.4 39.6 480 69.5 480h82.3c20.1 0 37.7-11.2 48.3-27.7l-41.5-41.5c-1.6.3-3.2.7-4.9.7z"/>
        </svg>
      </div>
      <h1 className="text-2xl md:text-3xl leading-[2rem] md:leading-[3.4rem] font-semibold font-mont text-mainred">
        Unleashing Creativity and Precision
      </h1>
      <p className="text-lg line-clamp-5">
        Explore the world of robotics engineering at AMURoboclub, where creativity and precision converge. We empower students to bring their ideas to life, encouraging exploration across domains such as machine learning, embedded systems, and mechanical engineering.
      </p>
      <a className="text-lg font-medium hover:text-red-800">Join the Movement</a>
    </motion.div>
  </div>
</div>

      <Faqs />
      <Footer />
    </main>
  );
}
