import Image from "next/image"
import Link from "next/link"
import Logo from "../src/assets/logo.png";

export default function Navbar(){

    return(
        <nav className="flex justify-between items-center pr-4 h-[13vh] bg-mainlight">
              <Image 
                  src={Logo} 
                  alt="amuroboclub logo" 
                  height={60}
                  className="p-4 rounded-l-[30px]"
              />
              <div className="hidden md:flex gap-5 text-sm">
                  <Link href={'/'}>Home</Link>
                  <Link href={'/notices'}>Notices</Link>
                  <Link href={'/projects'}>Projects</Link>
                  <Link href={'/blogs'}>Blogs</Link>
                  <Link href={'/team'}>Team</Link>
                  <Link href={'/contributors'}>Contributors</Link>
                  <Link href={'/amusat'}>AMUSAT</Link>
                  <Link href={'/recruitment'}>Project Recruitment</Link>
                  <Link href={'/newsletter'}>Newsletter</Link>
                  <Link href={'/contactus'}>Contact Us</Link>
              </div>
          </nav>
    )
}