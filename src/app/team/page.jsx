"use client"; // Keep this if you are using state management

import Image from 'next/image';
import { useState } from 'react';
import pic from '../../assets/profileSA1.jpg';
import linkedin from '../../assets/linkedin.png';
import x from '../../assets/x.png';

const teamData = {
  cords: [
    { name: 'Imad Bin Asad', img: pic, position: 'Co-ordinator', class: 'Mechanical Class of 2025' },
    { name: 'Suhaib Shahid', img: pic, position: 'Co-ordinator', class: 'Mechanical Class of 2025' }, 
    { name: 'Fatima', img: pic, position: 'Co-ordinator', class: 'Mechanical Class of 2025' },
    { name: 'Megha', img: pic, position: 'Co-ordinator', class: 'Mechanical Class of 2025' },
  ],
  jointcords: [
    { name: 'Imad Bin Asad', img: pic, position: 'Co-ordinator', class: 'Mechanical Class of 2025' },
    { name: 'Suhaib Shahid', img: pic, position: 'Co-ordinator', class: 'Mechanical Class of 2025' }, 
    { name: 'Fatima', img: pic, position: 'Co-ordinator', class: 'Mechanical Class of 2025' },
    { name: 'Megha', img: pic, position: 'Co-ordinator', class: 'Mechanical Class of 2025' },
  ],
  webdev: [
    { name: 'Sharjeel Afridi', img: pic, position: 'Web Developer', class: 'Automobile Class of 2027', linkedin: 'https://www.linkedin.com/in/sharjeelafridi/' },
    { name: 'Avyukt Soni', img: pic, position: 'Web Developer', class: 'Computer Class of 2027', linkedin: 'https://www.linkedin.com/in/avyukt-soni-1b1b3b1b3/' }, 
  ],
  voluenteer: [
    { name: 'Imad Bin Asad', img: pic, position: 'Co-ordinator', class: 'Mechanical Class of 2025' },
    { name: 'Suhaib Shahid', img: pic, position: 'Co-ordinator', class: 'Mechanical Class of 2025' }, 
    { name: 'Fatima', img: pic, position: 'Co-ordinator', class: 'Mechanical Class of 2025' },
    { name: 'Megha', img: pic, position: 'Co-ordinator', class: 'Mechanical Class of 2025' },
  ],
  pr: [
    { name: 'Imad Bin Asad', img: pic, position: 'Co-ordinator', class: 'Mechanical Class of 2025' },
    { name: 'Suhaib Shahid', img: pic, position: 'Co-ordinator', class: 'Mechanical Class of 2025' }, 
    { name: 'Fatima', img: pic, position: 'Co-ordinator', class: 'Mechanical Class of 2025' },
    { name: 'Megha', img: pic, position: 'Co-ordinator', class: 'Mechanical Class of 2025' },
  ]
};

export default function Team() {
  const [teamType, setTeamType] = useState('cords');

  const handleClick = (type) => {
    setTeamType(type);
  };

  const handleLinkClick = (link) => () => {
    window.open(link, '_blank');
  };

  return (
    <main className="w-full min-h-screen flex flex-col items-start px-5 md:px-40 pt-20 text-[#0b2059]">
      <h1 className="text-4xl md:text-5xl font-medium text-center">Our Leadership Team</h1>    
      <div className="flex gap-5 font-medium text-[0.89rem] md:text-xl pt-10">
        <h1 className={`cursor-pointer pb-10 ${teamType === 'cords' ? 'border-b-2 border-blue-800' : 'text-[#0b2059]/80'}`} onClick={() => handleClick('cords')}>CO-ORDINATORS</h1>
        <h1 className={`cursor-pointer pb-10 ${teamType === 'jointcords' ? 'border-b-2 border-blue-800' : 'text-[#0b2059]/80'}`} onClick={() => handleClick('jointcords')}>JOINT CO-ORDINATORS</h1>
        <h1 className={`cursor-pointer pb-10 ${teamType === 'webdev' ? 'border-b-2 border-blue-800' : 'text-[#0b2059]/80'}`} onClick={() => handleClick('webdev')}>WEB DEVELOPERS</h1>
        <h1 className={`cursor-pointer pb-10  ${teamType === 'voluenteer' ? 'border-b-2 border-blue-800' : 'text-[#0b2059]/80'}`} onClick={() => handleClick('voluenteer')}>VOLUNTEERS</h1>
        <h1 className={`cursor-pointer pb-10  ${teamType === 'pr' ? 'border-b-2 border-blue-800' : 'text-[#0b2059]/80'}`} onClick={() => handleClick('pr')}>PR</h1>
      </div>

      {/* TEAM PHOTOS */}
      <div className='flex justify-between flex-wrap gap-5 pb-20'>
        {teamData[teamType].map((member, index) => (
          <div key={index} className="flex flex-col gap-5 mt-10 w-[40vw] md:w-[18rem]  rounded-xl bg-[#dbe3f8]">
            <Image src={member.img} alt={member.name} className="object-cover h-[10rem] rounded-tl-2xl" />
            <div className='flex flex-col gap-3 pb-5'>
              <h1 className="text-[1.6rem] font-medium pl-5">{member.name}</h1>
              <h1 className="text-xl font-normal pl-5">{member.position}</h1>
              <h1 className="text-lg font-normal pl-5">{member.class}</h1>
              <Image src={linkedin} alt="linkedin" className="w-10 h-10 ml-5 cursor-pointer" onClick={handleLinkClick(member.linkedin)} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
