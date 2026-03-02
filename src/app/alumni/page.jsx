"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Briefcase,
  GraduationCap,
  Calendar,
  Linkedin,
  ChevronDown,
  ChevronUp,
  User,
} from "lucide-react";

const AlumniSkeleton = () => (
  <div className="animate-pulse flex flex-col rounded-2xl overflow-hidden border border-gray-700 bg-gray-800/50 h-[420px]">
    <div className="h-64 bg-gray-700" />
    <div className="p-6 space-y-3">
      <div className="h-6 bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-700 rounded w-1/2" />
      <div className="h-4 bg-gray-700 rounded w-full" />
    </div>
  </div>
);

function AlumniCard({ alum, index }) {
  const [expanded, setExpanded] = useState(false);
  const hasExtra =
    alum.professionalGrowth ||
    alum.briefSummary ||
    alum.inspireNextGen;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="rounded-2xl overflow-hidden border border-gray-700 bg-gradient-to-b from-gray-800/90 to-gray-900/90 hover:border-cyan-500/40 transition-all duration-300 shadow-xl hover:shadow-cyan-500/10"
    >
      <div className="relative h-56 sm:h-64 bg-gray-800">
        {alum.photoUrl ? (
          <Image
            src={alum.photoUrl}
            alt={alum.fullName}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-900/40 to-gray-800 text-4xl font-bold text-cyan-400/80">
            {alum.fullName?.charAt(0) || "?"}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white drop-shadow-lg">
            {alum.fullName}
          </h3>
          {alum.positionOrRole && (
            <p className="text-cyan-300 text-sm font-medium">
              {alum.positionOrRole}
            </p>
          )}
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap gap-2 text-sm text-gray-400">
          {alum.graduationYear && (
            <span className="inline-flex items-center gap-1">
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              Graduated {alum.graduationYear}
            </span>
          )}
          {alum.activeYears && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-4 h-4 text-teal-400" />
              {alum.activeYears}
            </span>
          )}
        </div>

        {alum.degreeProgram && (
          <p className="text-gray-300 text-sm flex items-start gap-2">
            <User className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
            {alum.degreeProgram}
          </p>
        )}

        {(alum.currentOccupation || alum.companyName) && (
          <p className="text-gray-300 text-sm flex items-start gap-2">
            <Briefcase className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
            {[alum.currentOccupation, alum.companyName]
              .filter(Boolean)
              .join(alum.currentOccupation && alum.companyName ? " at " : "")}
          </p>
        )}

        {alum.linkedInOrSocial && (
          <a
            href={alum.linkedInOrSocial}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium"
          >
            <Linkedin className="w-4 h-4" />
            LinkedIn / Profile
          </a>
        )}

        {hasExtra && (
          <>
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Read more
                </>
              )}
            </button>
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-4 text-sm text-gray-400 border-t border-gray-700 pt-4"
                >
                  {alum.professionalGrowth && (
                    <div>
                      <p className="text-gray-500 font-medium mb-1">
                        Impact on career
                      </p>
                      <p className="text-gray-400">{alum.professionalGrowth}</p>
                    </div>
                  )}
                  {alum.briefSummary && (
                    <div>
                      <p className="text-gray-500 font-medium mb-1">
                        About
                      </p>
                      <p className="text-gray-400">{alum.briefSummary}</p>
                    </div>
                  )}
                  {alum.inspireNextGen && (
                    <div>
                      <p className="text-gray-500 font-medium mb-1">
                        Message to the next generation
                      </p>
                      <p className="text-gray-400 italic">
                        &ldquo;{alum.inspireNextGen}&rdquo;
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </motion.article>
  );
}

export default function AlumniPage() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const snapshot = await getDocs(collection(db, "alumni"));
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        list.sort(
          (a, b) => (b.submittedTimestamp || 0) - (a.submittedTimestamp || 0)
        );
        setAlumni(list);
      } catch (err) {
        console.error("Error fetching alumni:", err);
        setError("Unable to load alumni. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchAlumni();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <section className="px-4 py-12 lg:px-10 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
              Our Alumni
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Where our past members are today—stories, careers, and messages
              for the next generation of AMU Roboclub.
            </p>
            <Link
              href="/alumni/register"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold transition-all"
            >
              Share your story
            </Link>
          </div>

          {error && (
            <div className="text-center py-12 text-red-400">{error}</div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <AlumniSkeleton key={i} />
              ))}
            </div>
          ) : alumni.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg">No alumni profiles yet.</p>
              <Link
                href="/alumni/register"
                className="text-cyan-400 hover:text-cyan-300 mt-2 inline-block"
              >
                Be the first to register →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {alumni.map((alum, index) => (
                <AlumniCard key={alum.id} alum={alum} index={index} />
              ))}
            </div>
          )}
        </motion.div>
      </section>
      <Footer />
    </main>
  );
}
