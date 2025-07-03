"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  Globe,
  Calendar,
  Users,
  X,
  Linkedin,
  Clock,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Footer from "../components/Footer";

const getStatusInfo = (status) => {
  switch (status) {
    case "in_progress":
      return {
        color: "text-amber-400",
        icon: Clock,
        text: "In Progress",
        bgColor: "bg-amber-400/20",
      };
    case "completed":
      return {
        color: "text-emerald-400",
        icon: CheckCircle,
        text: "Completed",
        bgColor: "bg-emerald-400/20",
      };
    default:
      return {
        color: "text-gray-400",
        icon: Clock,
        text: "Unknown",
        bgColor: "bg-gray-400/20",
      };
  }
};

const truncateText = (text, maxLength) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const ProjectSkeleton = () => (
  <div className="bg-gray-800/50 rounded-2xl overflow-hidden animate-pulse border border-gray-700/50">
    <div className="w-full h-48 bg-gray-700/50" />
    <div className="p-6">
      <div className="h-6 bg-gray-700/50 rounded-lg mb-3"></div>
      <div className="h-4 bg-gray-700/50 rounded-lg mb-3"></div>
      <div className="h-4 bg-gray-700/50 rounded-lg mb-4 w-3/4"></div>
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-700/50 rounded-lg w-1/3"></div>
        <div className="h-6 bg-gray-700/50 rounded-full w-1/4"></div>
      </div>
    </div>
  </div>
);

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const filteredProjects = querySnapshot.docs
          .map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              title: data.name,
              date: data.date,
              description: data.description,
              image: data.projectImg?.[0] || "",
              status: data.progress === "100" ? "completed" : "in_progress",
              team:
                data.teamMembers?.map((member) => ({
                  name: member.member,
                  linkedin: member.linkedinId,
                })) || [],
              github: data.github || null,
              demo: data.link || null,
              technologies: data.technologies || [],
            };
          })
          .filter(
            (project) =>
              project.title &&
              project.description &&
              project.image &&
              project.team.length > 0
          );

        setProjects(filteredProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  console.log("projects", projects);

  const handleSelectProject = (project) => {
    setSelectedProject(project);
  };

  const closeProjectDetails = () => {
    setSelectedProject(null);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-black/80 backdrop-blur-xl border-b border-gray-800/50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[32px] mt-5 font-bold text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            AMURoboclub Projects
          </motion.h1>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid gap-12 sm:grid-cols-2 items-center justify-center lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProjectSkeleton />
                </motion.div>
              ))
            : projects.map((project, index) => {
                const {
                  color,
                  icon: Icon,
                  text,
                  bgColor,
                } = getStatusInfo(project.status);
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group w-[380px] bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800/50 hover:border-gray-700/70 cursor-pointer transition-all duration-300"
                    onClick={() => handleSelectProject(project)}
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Project Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Status Badge */}
                      <div
                        className={`absolute top-4 right-4 ${bgColor} backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5`}
                      >
                        <Icon className={`w-3 h-3 ${color}`} />
                        <span
                          className={`!font-mono text-xs font-medium ${color}`}
                        >
                          {text}
                        </span>
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="p-6">
                      <h3 className="!font-mono text-[20px] leading-[1.2rem] font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-400 !font-mono text-[16px] mb-4">
                        {truncateText(project.description, 100)}
                      </p>

                      {/* Date and Team */}
                      <div className="!font-mono flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>
                            {new Date(project.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Users className="w-4 h-4 mr-2" />
                          <span>
                            {project.team.length} member
                            {project.team.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
        </div>
      </div>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={closeProjectDetails}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-gray-900/95 backdrop-blur-xl rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-800/50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />

                {/* Close Button */}
                <button
                  onClick={closeProjectDetails}
                  className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                {/* Status Badge */}
                <div className="absolute bottom-4 right-4">
                  {(() => {
                    const {
                      color,
                      icon: Icon,
                      text,
                      bgColor,
                    } = getStatusInfo(selectedProject.status);
                    return (
                      <div
                        className={`${bgColor} !font-mono backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2`}
                      >
                        <Icon className={`w-4 h-4 ${color}`} />
                        <span
                          className={`text-sm !font-mono font-medium ${color}`}
                        >
                          {text}
                        </span>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Content */}
              <div className="!font-mono p-8 max-h-[calc(90vh-16rem)] overflow-y-auto">
                <h2 className="text-3xl font-bold mb-4 text-white">
                  {selectedProject.title}
                </h2>

                <p className="text-gray-300 mb-6 leading-relaxed">
                  {selectedProject.description}
                </p>

                {/* Project Meta */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* Date */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Project Date</p>
                      <p className="text-white font-medium">
                        {new Date(selectedProject.date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Team Size */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Users className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Team Size</p>
                      <p className="text-white font-medium">
                        {selectedProject.team.length} member
                        {selectedProject.team.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Team Members */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-white">
                    Team Members
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.team.map((member, index) => (
                      <a
                        key={index}
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-gray-800/50 hover:bg-gray-800/80 rounded-lg px-4 py-2 transition-colors group"
                      >
                        <Linkedin className="w-4 h-4 text-blue-400" />
                        <span className="text-white group-hover:text-blue-400 transition-colors">
                          {member.name}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                {selectedProject.technologies &&
                  selectedProject.technologies.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-4 text-white">
                        Technologies Used
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/30"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  {selectedProject.github && (
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-colors group"
                    >
                      <Github className="w-5 h-5" />
                      <span>View Code</span>
                      <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </a>
                  )}
                  {selectedProject.demo && (
                    <a
                      href={selectedProject.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all group"
                    >
                      <Globe className="w-5 h-5" />
                      <span>Live Demo</span>
                      <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
}
