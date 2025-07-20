"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../assets/Vlogo.d83a8feb5370b0b7c52a.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  // For staggered animation
  const [visibleItems, setVisibleItems] = useState([false, false, false, false]);
  // For container animation
  const [showMenuContainer, setShowMenuContainer] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowMenuContainer(true);
    } else if (showMenuContainer) {
      // Wait for animation before unmounting
      const timeout = setTimeout(() => setShowMenuContainer(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setVisibleItems([false, false, false, false]);
      const timeouts = [0, 1, 2, 3].map((i) =>
        setTimeout(() => {
          setVisibleItems((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, 100 + i * 100)
      );
      return () => timeouts.forEach((t) => clearTimeout(t));
    } else {
      setVisibleItems([false, false, false, false]);
    }
  }, [isOpen]);

  // Close menu if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className={`flex justify-between items-center px-4 py-5 md:pt-10 md:h-[13vh]`}
    >
      <Link href={"/"}>
        <Image
          src={Logo}
          alt="amuroboclub logo"
          className="p-2 bg-black h-[40px] md:h-[50px] w-fit"
        />
      </Link>

      {/* Hamburger Menu Button */}
      <button
        ref={menuButtonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden focus:outline-none"
      >
        <div className="space-y-2   scale-75">
          <span className="block w-8 h-0.5 bg-white"></span>
          <span className="block w-8 h-0.5 bg-white"></span>
          <span className="block w-8 h-0.5 bg-white"></span>
        </div>
      </button>

      {/* Desktop Menu */}
      <div className="hidden md:flex justify-between items-center gap-10">
        <Link
          href={"/projects"}
          className="hover:border-blue-600 hover:text-blue-600 text-white border-b-2 border-transparent transition-all duration-50"
        >
          <p className="text-[14px]">PROJECTS</p>
        </Link>
        <Link
          href={"/team"}
          className="hover:border-blue-600 hover:text-blue-600 text-white border-b-2 border-transparent transition-all duration-50"
        >
          <p className="text-[14px]">TEAM</p>
        </Link>
        <Link
          href={"/events"}
          prefetch={true}
          className="hover:border-blue-600 hover:text-blue-600 text-white border-b-2 border-transparent transition-all duration-50"
        >
          <p className="text-[14px]">EVENTS</p>
        </Link>
        <Link
          href={"/members"}
          className="hover:border-blue-600 hover:text-blue-600 text-white border-b-2 border-transparent transition-all duration-50"
        >
          <p className="text-[14px]">MEMBERS</p>
        </Link>{" "}
        {/* <Link
          href={"/membershipForm"}
          className="hover:border-blue-600 hover:text-blue-600 text-white border-b-2 border-transparent transition-all duration-50"
        >
          <p className="text-[14px]">MEMBERSHIP</p>
        </Link> */}
        <div>
          <Link
            href="/membershipForm"
            className="group flex text-white items-center gap-5 w-fit border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-300 px-5 py-2 rounded-full font-bold text-[1.1rem]"
          >
            <p className="text-[14px]">Become a Member</p>
            <span className="flex justify-end w-0 h-4 -ml-2 pointer-events-none overflow-hidden transition-[width] duration-300 group-hover:w-6">
              <svg
                className="block w-4 h-4 flex-initial pointer-events-none fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                aria-hidden="true"
              >
                <path d="M113.3 47.41l183.1 191.1c4.469 4.625 6.688 10.62 6.688 16.59s-2.219 11.97-6.688 16.59l-183.1 191.1c-9.152 9.594-24.34 9.906-33.9 .7187c-9.625-9.125-9.938-24.38-.7187-33.91l168-175.4L78.71 80.6c-9.219-9.5-8.906-24.78 .7187-33.91C88.99 37.5 104.2 37.82 113.3 47.41z"></path>
              </svg>
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMenuContainer && (
        <div
          ref={menuRef}
          style={{ zIndex: "100" }}
          className={`md:hidden absolute top-[13vh] left-0 w-full bg-black px-3 py-5 transition-all duration-400 transform ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
        >
          <div className="grid grid-cols-3 gap-4">
            <Link
              href={"/projects"}
              className={`flex justify-center hover:text-blue-600 text-[white] !font-mono text-[16px] transition-all duration-500 transform ${visibleItems[0] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              onClick={() => setIsOpen(false)}
            >
              Projects
            </Link>
            <Link
              href={"/team"}
              className={`flex justify-center hover:text-blue-600 text-[white] !font-mono text-[16px] transition-all duration-500 transform ${visibleItems[1] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              onClick={() => setIsOpen(false)}
            >
              Team
            </Link>
            <Link
              href={"/events"}
              className={`flex justify-center hover:text-blue-600 text-[white] !font-mono text-[16px] transition-all duration-500 transform ${visibleItems[2] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              onClick={() => setIsOpen(false)}
            >
              Events
            </Link>
          </div>
          <div className={`mt-6 flex justify-center transition-all duration-500 transform ${visibleItems[3] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Link
              href="/membershipForm"
              className="group flex text-white items-center gap-5 w-full border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-300 px-5 py-2 rounded-full font-bold text-[1.1rem] justify-center"
              onClick={() => setIsOpen(false)}
            >
              <p className="text-[14px]">Become a Member</p>
              <span className="flex justify-end w-0 h-4 -ml-2 pointer-events-none overflow-hidden transition-[width] duration-300 group-hover:w-6">
                <svg
                  className="block w-4 h-4 flex-initial pointer-events-none fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                  aria-hidden="true"
                >
                  <path d="M113.3 47.41l183.1 191.1c4.469 4.625 6.688 10.62 6.688 16.59s-2.219 11.97-6.688 16.59l-183.1 191.1c-9.152 9.594-24.34 9.906-33.9 .7187c-9.625-9.125-9.938-24.38-.7187-33.91l168-175.4L78.71 80.6c-9.219-9.5-8.906-24.78 .7187-33.91C88.99 37.5 104.2 37.82 113.3 47.41z"></path>
                </svg>
              </span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
