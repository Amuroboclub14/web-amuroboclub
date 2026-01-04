"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Calendar,
  Users,
  FolderOpen,
  Star,
  UserCheck,
  Settings,
  LogOut,
  GraduationCap,
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState(null);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  };

  const handleOptionClick = (optionId) => {
    router.push(`/admin/${optionId}`);
  };

  const adminOptions = [
    {
      id: "events",
      title: "Events",
      description: "Manage club events and competitions",
      icon: Calendar,
      color: "from-blue-500 to-blue-600",
      hoverColor: "hover:border-blue-400",
    },
    {
      id: "members",
      title: "Members",
      description: "View and manage club members",
      icon: Users,
      color: "from-green-500 to-green-600",
      hoverColor: "hover:border-green-400",
    },
    {
      id: "projects",
      title: "Projects",
      description: "Manage main projects showcase",
      icon: FolderOpen,
      color: "from-purple-500 to-purple-600",
      hoverColor: "hover:border-purple-400",
    },
    {
      id: "landing-projects",
      title: "Landing Page Projects",
      description: "Manage featured projects on homepage",
      icon: Star,
      color: "from-yellow-500 to-yellow-600",
      hoverColor: "hover:border-yellow-400",
    },
    {
      id: "team",
      title: "Team",
      description: "Manage team members and roles",
      icon: UserCheck,
      color: "from-indigo-500 to-indigo-600",
      hoverColor: "hover:border-indigo-400",
    },
    {
      id: "faculty",
      title: "Faculty",
      description: "Manage faculty members and advisors",
      icon: GraduationCap,
      color: "from-teal-500 to-teal-600",
      hoverColor: "hover:border-teal-400",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-mono">Admin Panel</h1>
                <p className="text-gray-400 text-sm font-mono">
                  AMURoboclub Management
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/20 hover:border-red-500/40 transition-all duration-300 font-mono"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-mono mb-4">
            Welcome to the Control Center 🚀
          </h2>
          <p className="text-gray-400 font-mono text-lg">
            Select an option below to manage your data
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                className={`
                  group relative bg-gray-900/50 border border-gray-800 rounded-2xl p-6 cursor-pointer
                  transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-400/10
                  ${option.hoverColor} hover:border-opacity-60
                  ${
                    selectedOption === option.id
                      ? "border-blue-400 bg-blue-400/5"
                      : ""
                  }
                `}
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-5 rounded-2xl`}
                />

                {/* Content */}
                <div className="relative z-10">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${option.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-xl font-bold font-mono mb-2 group-hover:text-blue-400 transition-colors duration-300">
                    {option.title}
                  </h3>

                  <p className="text-gray-400 font-mono text-sm leading-relaxed">
                    {option.description}
                  </p>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            );
          })}
        </div>

        {/* Selected Option Display */}
        {selectedOption && (
          <div className="mt-12 p-6 bg-gray-900/50 border border-gray-800 rounded-2xl">
            <div className="text-center">
              <h3 className="text-xl font-bold font-mono text-blue-400 mb-2">
                {adminOptions.find((opt) => opt.id === selectedOption)?.title}{" "}
                Management
              </h3>
              <p className="text-gray-400 font-mono">
                CRUD operations for {selectedOption} will be implemented here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
