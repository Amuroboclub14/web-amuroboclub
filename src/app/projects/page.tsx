"use client";

import { useState } from "react";
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

// Mock data for projects
const projects = [
  {
    id: 1,
    title: "GSM based Intruder Alarm",
    description:
      "This is a prototype device prepared for security purposes,made under the guidance of MOHD. TALHA. We have mainly used GSM 300 Module, PIR Sensor ,Cell Phone and ATMEGA 16 (or any other embedded system you like). The whole concept behind this is what whenever an intruder will pass infront of the PIR Sensor, according to the infrared changes , it detects ,correspondingly an alert message will be sent to the user’s cell phone.",
    image:
      "https://firebasestorage.googleapis.com/v0/b/amu-roboclub.appspot.com/o/projects%2FGSM%20based%20Intruder%20Alarm%2F52802546072518513995408544348591700?alt=media&token=2a36b4c8-bec0-46ce-adc9-a676e18f6dde",
    date: "2017-05-18",
    status: "completed",
    team: [
      {
        name: "Manjari Agrawal",
        // linkedin: "https://www.linkedin.com/in/johndoe",
      },
      {
        name: "Suhani Pandey",
        // linkedin: "https://www.linkedin.com/in/janesmith",
      },
    ],
    // github: "https://github.com/AMURoboclub/autonomous-drone",
    // demo: "https://amuroboclub.com/projects/autonomous-drone",
    technologies: ["Atmega 16", "GSM 300 Sensor", "PIR Sensor"],
  },
  {
    id: 2,
    title: "Health Care Monitoring System For Pregnant Women Elderly People",
    description:
      "Health Care Monitoring System For Pregnant Women Elderly  People",
    image:
      "https://firebasestorage.googleapis.com/v0/b/amu-roboclub.appspot.com/o/projects%2FHealth%20Care%20Monitoring%20System%20For%20Pregnant%20Women%20Elderly%20%20People%2Fimg1.jpeg?alt=media&token=7e9754a7-7dd8-4209-a7b3-7fd56edd45fd",
    date: "2022-09-01",
    status: "completed",
    team: [
      {
        name: "Megha Pachauri",
        linkedin: "https://www.linkedin.com/in/megha-pachauri-6a0181203",
      },
      {
        name: "Ayush Sharma",
        // linkedin: "https://www.linkedin.com/in/janesmith",
      },
      {
        name: "Saumya Agarwal",
        linkedin: "https://www.linkedin.com/in/saumya-agarwal-591ab3243/",
      },
      {
        name: "Lavish Upadhayay",
        linkedin: "https://www.linkedin.com/in/lavish-upadhyay-35a782223/",
      },
    ],
    // github: "https://github.com/AMURoboclub/agri-bot",
    demo: "https://drive.google.com/file/d/1KN0WQwH-XvLa-e-373VtRDbTxWoTJCvd/view",
    technologies: ["Arduino", "C++", "IoT"],
  },
  {
    id: 3,
    title: "Robotic Arm for Medical Assistance",
    description:
      "A precise robotic arm designed to assist surgeons in delicate medical procedures.",
    image: "/placeholder.svg?height=200&width=300",
    date: "2024",
    status: "completed",
    team: ["Eva Green", "Frank White", "Grace Lee"],
    github: "https://github.com/AMURoboclub/medical-arm",
    demo: "https://amuroboclub.com/projects/medical-arm",
    technologies: ["ROS", "C++", "Computer Vision"],
  },
  {
    id: 4,
    title: "Swarm Robotics Platform",
    description:
      "A platform for developing and testing swarm robotics algorithms with multiple small robots.",
    image: "/placeholder.svg?height=200&width=300",
    date: "2023",
    status: "completed",
    team: ["David Miller", "Emma Wilson"],
    github: "https://github.com/AMURoboclub/swarm-platform",
    demo: "https://amuroboclub.com/projects/swarm-platform",
    technologies: ["Python", "ROS", "Machine Learning"],
  },
  {
    id: 5,
    title: "Humanoid Robot",
    description:
      "A humanoid robot capable of natural movement and basic interaction with humans.",
    image: "/placeholder.svg?height=200&width=300",
    date: "2025",
    status: "completed",
    team: ["Sophia Chen", "Raj Patel", "Maria Garcia"],
    github: "https://github.com/AMURoboclub/humanoid-robot",
    demo: "https://amuroboclub.com/projects/humanoid-robot",
    technologies: ["C++", "ROS", "AI", "Computer Vision"],
  },
];

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

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState(null);

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
                  {project.description}
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
                className="bg-white rounded-lg w-full max-w-2xl overflow-hidden"
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
                      {selectedProject.technologies.map((tech, index) => (
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
