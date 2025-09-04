"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar";
import { AnimatedCounter } from "../components/Animated-Counter";
import {
  Search,
  User,
  Hash,
  BadgeIcon as IdCard,
  Calendar,
} from "lucide-react";
import Footer from "../components/Footer";

export default function Members() {
  const [membersData, setMembersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "members_2025"));
        const membersList = querySnapshot.docs
          .map((doc) => {
            const data = doc.data();
            return {
              name: data.name || "",
              enrollmentNumber: data.enrollmentNumber || "",
              facultyNumber: data.facultyNumber || "",
              email: data.email || "",
              memberSince: data.submittedTimestamp || "",
              paymentStatus: data.paymentStatus || false,
            };
          })
          .filter((member) => member.paymentStatus === true);
        setMembersData(membersList);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const filteredMembers = membersData.filter(
    (member) =>
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.enrollmentNumber
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      member.facultyNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    try {
      const date = new Date(timestamp); // timestamp is number, not string
      return date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  return (
    <>
      <main className="w-full min-h-screen bg-black pb-10">
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 font-mont">
          <h1 className="text-[2.5rem] sm:text-[3.4rem] md:text-[4.5rem] font-bold leading-tight bg-gradient-to-br from-white to-sky-300 bg-clip-text text-transparent pb-8 text-center">
            Members
          </h1>
          <br />

          {/* Search + Counter */}
          <div className="flex flex-col md:flex-row md:justify-between items-stretch md:items-center gap-4 mb-8">
            <div className="flex w-full md:max-w-xl">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Member"
                className="flex-1 px-4 py-3 w-[70vw] md:w-full rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-sky-400 hover:bg-sky-600 px-4 rounded-r-lg flex items-center justify-center text-white">
                <Search size={22} />
              </button>
            </div>

            <div className="flex justify-center md:justify-end">
              <div className="inline-block bg-gray-900/30 border border-green-400/20 rounded-lg px-4 py-2 backdrop-blur-sm">
                <span className="text-gray-400 font-mono text-sm">
                  SHOWING:{" "}
                </span>
                <span className="text-green-400 text-lg font-mono">
                  <AnimatedCounter end={filteredMembers.length} />
                </span>
                <span className="text-gray-400 font-mono text-sm">
                  {" "}
                  / {membersData.length} MEMBERS
                </span>
              </div>
            </div>
          </div>

          {/* Member Grid */}
          {loading ? (
            <div className="text-center text-gray-400">Loading members...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
              {filteredMembers.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-400 font-mono text-sm">
                    {">"} No members found
                  </p>
                </div>
              ) : (
                filteredMembers.map((member, index) => (
                  <div
                    key={member.id || index}
                    className="
                    group relative bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-green-400/20 rounded-xl
                    backdrop-blur-lg hover:border-green-400/40 hover:shadow-lg hover:shadow-green-400/20
                    transition-all duration-500 hover:scale-[1.02] p-5
                  "
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-blue-400/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative space-y-3">
                      <div className="flex items-center space-x-2">
                        <User className="text-green-400 w-4 h-4" />
                        <h3 className="font-bold text-white font-mono leading-tight text-lg sm:text-xl">
                          {member.name}
                        </h3>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center space-x-2">
                          <Hash className="text-blue-400 w-3 h-3" />
                          <span className="text-white font-mono text-base">
                            {member.enrollmentNumber}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <IdCard className="text-purple-400 w-3 h-3" />
                          <span className="text-white font-mono text-base">
                            {member.facultyNumber}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="text-yellow-400 w-3 h-3 flex-shrink-0" />
                          <div>
                            <span className="text-gray-400 text-xs font-mono">
                              MEMBER SINCE:{" "}
                            </span>
                            <span className="text-yellow-400 font-mono font-semibold text-sm">
                              {formatDate(member.memberSince)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
