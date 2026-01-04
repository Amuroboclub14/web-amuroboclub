"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Mail, User, Building, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

export default function Faculty() {
  const [facultyData, setFacultyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "faculty"));
        const facultyList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched faculty data:", facultyList);
        setFacultyData(facultyList);
      } catch (error) {
        console.error("Error fetching faculty:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, []);

  const categorizedFaculty = {
    incharge: facultyData.filter((member) => member.category === "incharge"),
    advisors: facultyData.filter((member) => member.category === "advisor"),
    patrons: facultyData.filter((member) => member.category === "patron"),
  };

  const FacultyCard = ({ member, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-gradient-to-br from-gray-900/70 to-gray-800/70 border border-green-400/30 rounded-2xl backdrop-blur-lg hover:border-green-400/50 hover:shadow-xl hover:shadow-green-400/25 transition-all duration-500 hover:scale-[1.03] p-8 w-full max-w-sm mx-auto"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-green-400/8 to-blue-400/8 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative space-y-6">
        {/* Profile Image */}
        <div className="flex justify-center">
          <div className="w-32 h-32 rounded-full overflow-hidden border-3 border-green-400/40 shadow-lg shadow-green-400/20">
            <img
              src={member.image || "/api/placeholder/128/128"}
              alt={member.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                console.error(
                  `Failed to load image for ${member.name}:`,
                  member.image
                );
              }}
              onLoad={() => {
                console.log(`Successfully loaded image for ${member.name}`);
              }}
            />
          </div>
        </div>

        {/* Name & Designation */}
        <div className="text-center space-y-2">
          <h3 className="font-bold text-white font-mono text-xl leading-tight">
            {member.name}
          </h3>
          <p className="text-green-400 font-mono text-base font-medium">
            {member.designation}
          </p>
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-center space-x-3 bg-gray-800/50 rounded-lg p-3">
            <Building className="text-blue-400 w-5 h-5 flex-shrink-0" />
            <span className="text-white font-mono text-sm text-center">
              {member.department}
            </span>
          </div>

          <div className="flex items-center justify-center space-x-3 bg-gray-800/50 rounded-lg p-3">
            <Mail className="text-purple-400 w-5 h-5 flex-shrink-0" />
            <a
              href={`mailto:${member.email}`}
              className="text-white font-mono text-sm hover:text-purple-400 transition-colors text-center break-all"
            >
              {member.email}
            </a>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="flex justify-center pt-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <div
              className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const CategorySection = ({ title, members, color }) => (
    <div className="mb-16">
      <h2 className={`text-3xl font-bold font-mono mb-8 text-center ${color}`}>
        {title}
      </h2>
      {members.length > 0 ? (
        <div className="flex justify-center">
          <div
            className={`grid gap-8 ${
              members.length === 1
                ? "grid-cols-1 max-w-md"
                : members.length === 2
                ? "grid-cols-1 sm:grid-cols-2 max-w-2xl"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl"
            }`}
          >
            {members.map((member, index) => (
              <FacultyCard key={member.id} member={member} index={index} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto bg-gray-900/30 border border-gray-700/50 rounded-xl p-8">
            <p className="text-gray-500 font-mono text-sm">
              {">"} No {title.toLowerCase()} found
            </p>
            <p className="text-gray-600 font-mono text-xs mt-2">
              Coming soon...
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <main className="w-full min-h-screen bg-black pb-16">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl font-bold text-white font-mono mb-6 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Faculty Members
            </h1>
            <p className="text-gray-400 font-mono text-xl max-w-2xl mx-auto leading-relaxed">
              Meet our distinguished faculty guiding AMURoboclub towards
              excellence in robotics and innovation
            </p>
            <div className="mt-8 flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
            </div>
          </motion.div>

          {loading ? (
            <div className="text-center text-gray-400 font-mono py-20">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mb-4"></div>
              <p>Loading faculty members...</p>
            </div>
          ) : (
            <div className="space-y-20">
              {/* In Charge */}
              <CategorySection
                title="In Charge"
                members={categorizedFaculty.incharge}
                color="text-yellow-400"
              />

              {/* Advisors */}
              <CategorySection
                title="Advisors"
                members={categorizedFaculty.advisors}
                color="text-blue-400"
              />

              {/* Patrons */}
              <CategorySection
                title="Patrons"
                members={categorizedFaculty.patrons}
                color="text-green-400"
              />

              {facultyData.length === 0 && (
                <div className="text-center py-20">
                  <div className="max-w-md mx-auto bg-gray-900/50 border border-gray-700/50 rounded-2xl p-12">
                    <p className="text-gray-400 font-mono text-lg mb-4">
                      {">"} No faculty members found
                    </p>
                    <p className="text-gray-600 font-mono text-sm">
                      Please check back later
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
