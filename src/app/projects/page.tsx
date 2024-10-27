"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import Image from "next/image";
import Navbar from "../components/Navbar";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const getStatusInfo = (status) => {
  switch (status) {
    case "in_progress":
      return { color: "text-yellow-500", icon: Clock, text: "In Progress" };
    case "completed":
      return { color: "text-green-500", icon: CheckCircle, text: "Completed" };
    default:
      return { color: "text-gray-500", icon: Clock, text: "Unknown" };
  }
};

const truncateText = (text, maxLength) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

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
      }
    };

    fetchProjects();
  }, []);

  const handleSelectProject = (project) => {
    setSelectedProject(project);
  };

  const closeProjectDetails = () => {
    setSelectedProject(null);
  };

  return (
    <main className="bg-mainlight">
      <Navbar />
      <div className="min-h-screen p-4 sm:p-8 bg-mainlight">
        <h1 className="text-4xl font-bold text-center mb-8 font-mont">
          AMURoboclub Projects
        </h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
              onClick={() => handleSelectProject(project)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Image
                src={project.image}
                alt={project.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {truncateText(project.description, 100)}{" "}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{project.date}</span>
                  </div>
                  {(() => {
                    const {
                      color,
                      icon: Icon,
                      text,
                    } = getStatusInfo(project.status);
                    return (
                      <div className={`flex items-center ${color}`}>
                        <Icon className="w-4 h-4 mr-1" />
                        <span>{text}</span>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={closeProjectDetails}
            >
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <Image
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    width={600}
                    height={300}
                    className="w-full h-64 object-cover"
                  />
                  <button
                    onClick={closeProjectDetails}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-6">
                  <h2 className="text-3xl font-bold mb-4">
                    {selectedProject.title}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {selectedProject.description}
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                        <span>{selectedProject.date}</span>
                      </div>
                      {(() => {
                        const {
                          color,
                          icon: Icon,
                          text,
                        } = getStatusInfo(selectedProject.status);
                        return (
                          <div className={`flex items-center ${color}`}>
                            <Icon className="w-5 h-5 mr-1" />
                            <span>{text}</span>
                          </div>
                        );
                      })()}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-2 text-gray-500" />
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.team.map((member, index) => (
                          <a
                            key={index}
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {member.name}
                          </a>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies &&
                        selectedProject.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-200 rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                    </div>

                    <div className="flex space-x-4">
                      <a
                        href={selectedProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:underline"
                      >
                        <Github className="w-5 h-5 mr-1" />
                        GitHub
                      </a>
                      <a
                        href={selectedProject.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:underline"
                      >
                        <Globe className="w-5 h-5 mr-1" />
                        Demo
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
