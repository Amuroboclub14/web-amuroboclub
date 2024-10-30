import Image from "next/image";
import Link from "next/link";
import Logo from "../../assets/Vlogo.d83a8feb5370b0b7c52a.png";

export default function Navbar({bgColor}) {
  return (
    <nav className={`flex justify-between items-center px-4 py-5 md:pt-10 md:h-[13vh] ${`md:bg-${bgColor}`} bg-white`}>
      <Link href={"/"}>
        <Image
          src={Logo}
          alt="amuroboclub logo"
          className="p-2 bg-black h-[40px] md:h-[50px] w-fit"
        />
      </Link>
      <div className="hidden md:flex justify-between items-center gap-10 text-[1.1rem] text-[]">
        <Link href={"/projects"}>Projects</Link>
        <Link href={"/team"}>Team</Link>
        <Link href={"/events"}>Events</Link>
        <Link href={"/gallery"}>Gallery</Link>
        <Link href={"/contributors"}>Contributors</Link>
        <Link href={"/amusat"}>AMUSAT</Link>
        <div className="w-[10rem]">
          <Link
            href="/contactus"
            className="group flex items-center gap-5 w-fit border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-300 px-5 py-2 rounded-full font-bold text-[1.1rem]"
          >
            About Us
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
    </nav>
  );
}
