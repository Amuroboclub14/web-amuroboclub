import { useState, useEffect } from "react";
import {
  ArrowRight,
  Calendar,
  Users,
  ExternalLink,
  Github,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const OurProjects = () => {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "specialProjects"));
        const filteredProjects = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            date: data.date,
            description: data.description,
            image: data.image,
            status: data.status,
            team:
              data.team?.map((member) => ({
                name: member.name,
                linkedin: member.linkedin,
              })) || [],
            github: data.github || null,
            demo: data.demo || null,
            technologies: data.technologies || [],
          };
        });

        setProjects(filteredProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <section className="min-h-screen bg-black px-4 py-8 mb-[24px]">
      <div className="max-w-7xl mx-auto">
        {/* Title Section */}
        <div className="text-center mb-16">
          <h2 className="text-[24px] md:text-[32px] font-bold mb-6 leading-tight">
            <span className="text-white ">Our Projects</span>
          </h2>
          <p className="text-gray-400 !font-mono text-lg md:text-xl max-w-3xl mx-auto">
            Innovation in Action & Real-World Implementation
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-cyan-400 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-400/20"
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              {/* Gradient Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

              {/* Project Image */}
              <div className="relative h-48 bg-gray-800 overflow-hidden">
                <Image
                  src={project.image}
                  width={100}
                  height={100}
                  className="w-full object-cover"
                />

                {/* Status Badge */}
                <div
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-mono font-semibold ${
                    project.status === "Completed"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  }`}
                >
                  {project.status}
                </div>
              </div>

              {/* Project Content */}
              <div className="flex flex-col justify-between h-fit p-6 relative z-10">
                <div className="flex items-center gap-4 text-xs text-gray-400 font-mono mb-3">
                  <div className="!font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {project.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {project.team.length}
                  </div>
                </div>

                <h3 className="text-[14px] md:h-[99px] lg:h-[80px] font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                  {project.title}
                </h3>

                <p className="!font-mono text-gray-400 text-sm mb-4 leading-relaxed">
                  {truncateText(project.description, 100)}
                </p>

                {/* Technologies */}
                {project.technologies.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 bg-gray-800 text-gray-300 rounded-md text-xs font-mono border border-gray-700"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-gray-800 text-gray-400 rounded-md text-xs font-mono border border-gray-700">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                ) : null}
                {/* Action Buttons */}
                <div className="flex gap-3">
                  {project.github ? (
                    <a href={project.github} target="_blank">
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 border border-gray-700 rounded-lg hover:bg-gray-700 hover:text-white transition-all duration-300 text-sm font-mono">
                        <ExternalLink className="w-4 h-4" />
                        Github Repo
                      </button>
                    </a>
                  ) : (
                    <Link href="/projects">
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 border border-gray-700 rounded-lg hover:bg-gray-700 hover:text-white transition-all duration-300 text-sm font-mono">
                        <ExternalLink className="w-4 h-4" />
                        Know More
                      </button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Hover Effect Border */}
              <div
                className={`absolute inset-0 rounded-2xl border-2 border-cyan-400/0 transition-all duration-300 pointer-events-none ${
                  hoveredProject === project.id ? "border-cyan-400/50" : ""
                }`}
              ></div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/projects">
            <button className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 border border-cyan-400/30 text-cyan-400 rounded-2xl hover:from-cyan-400/20 hover:to-blue-500/20 hover:border-cyan-400/50 transition-all duration-300 font-mono font-semibold text-lg hover:shadow-lg hover:shadow-cyan-400/25">
              <span>View All Projects</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OurProjects;
