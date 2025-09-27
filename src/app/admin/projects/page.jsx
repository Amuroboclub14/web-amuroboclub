"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  getAllDocuments,
  updateDocument,
  addFieldToDocument,
  deleteFieldFromDocument,
  deleteDocument,
  createDocument,
} from "../crudOperations";
import {
  ArrowLeft,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  FolderOpen,
} from "lucide-react";

export default function ProjectsManagement() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [editData, setEditData] = useState({});
  const [newField, setNewField] = useState({ key: "", value: "" });
  const [expandedProjects, setExpandedProjects] = useState(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    name: "",
    description: "",
    date: "",
    github: "",
    link: "",
    progress: "0",
    technologies: [],
    teamMembers: [],
    projectImg: [],
    category: "",
    status: "in_progress",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const result = await getAllDocuments("projects");
      if (result.success) {
        setProjects(result.data);
      } else {
        console.error("Error fetching projects:", result.error);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project.id);
    setEditData({ ...project });
    setNewField({ key: "", value: "" });
  };

  const handleSave = async () => {
    try {
      const { id, createdAt, updatedAt, ...dataToUpdate } = editData;
      const result = await updateDocument(
        "projects",
        editingProject,
        dataToUpdate
      );

      if (result.success) {
        await fetchProjects();
        setEditingProject(null);
        setEditData({});
      } else {
        console.error("Error updating project:", result.error);
        alert("Failed to update project: " + result.error);
      }
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Error updating project: " + error.message);
    }
  };

  const handleFieldChange = (key, value) => {
    setEditData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAddField = async () => {
    if (newField.key && newField.value) {
      try {
        const result = await addFieldToDocument(
          "projects",
          editingProject,
          newField.key,
          newField.value
        );

        if (result.success) {
          setEditData((prev) => ({
            ...prev,
            [newField.key]: newField.value,
          }));
          setNewField({ key: "", value: "" });
        } else {
          console.error("Error adding field:", result.error);
        }
      } catch (error) {
        console.error("Error adding field:", error);
      }
    }
  };

  const handleDeleteField = async (fieldKey) => {
    try {
      const result = await deleteFieldFromDocument(
        "projects",
        editingProject,
        fieldKey
      );

      if (result.success) {
        const updatedData = { ...editData };
        delete updatedData[fieldKey];
        setEditData(updatedData);
      } else {
        console.error("Error deleting field:", result.error);
      }
    } catch (error) {
      console.error("Error deleting field:", error);
    }
  };

  const toggleExpand = (projectId) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const handleDeleteProject = async (projectId, projectName) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${projectName}"? This action cannot be undone.`
      )
    ) {
      try {
        const result = await deleteDocument("projects", projectId);

        if (result.success) {
          await fetchProjects();
          alert("Project deleted successfully");
        } else {
          console.error("Error deleting project:", result.error);
          alert("Failed to delete project: " + result.error);
        }
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Error deleting project: " + error.message);
      }
    }
  };

  const handleAddProject = async () => {
    try {
      const result = await createDocument("projects", newProjectData);

      if (result.success) {
        await fetchProjects();
        setShowAddForm(false);
        setNewProjectData({
          name: "",
          description: "",
          date: "",
          github: "",
          link: "",
          progress: "0",
          technologies: [],
          teamMembers: [],
          projectImg: [],
          category: "",
          status: "in_progress",
        });
        alert("Project added successfully!");
      } else {
        console.error("Error adding project:", result.error);
        alert("Failed to add project: " + result.error);
      }
    } catch (error) {
      console.error("Error adding project:", error);
      alert("Error adding project: " + error.message);
    }
  };

  const handleNewProjectFieldChange = (key, value) => {
    setNewProjectData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400 font-mono">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/admin")}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <FolderOpen className="w-6 h-6 text-blue-400" />
                <h1 className="text-2xl font-bold font-mono">
                  Projects Management
                </h1>
              </div>
            </div>

            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-green-500/20 border border-green-500/40 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-colors font-mono"
            >
              <Plus className="w-5 h-5" />
              Add Project
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-gray-400 font-mono">
            Total Projects: {projects.length}
          </p>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden"
            >
              {/* Compact Card Header */}
              <div className="p-4 border-b border-gray-800">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold font-mono text-white mb-1">
                      {project.name || "Unnamed Project"}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400 font-mono">
                      <span>ID: {project.id}</span>
                      {project.date && (
                        <span className="flex items-center gap-1">
                          <FolderOpen className="w-3 h-3" />
                          {project.date}
                        </span>
                      )}
                      {project.progress && (
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                          {project.progress}% Complete
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/40 text-blue-400 px-3 py-1 rounded-lg hover:bg-blue-500/30 transition-colors font-mono text-sm"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteProject(
                          project.id,
                          project.name || "Unnamed Project"
                        )
                      }
                      className="flex items-center gap-2 bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-1 rounded-lg hover:bg-red-500/30 transition-colors font-mono text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>

                    <button
                      onClick={() => toggleExpand(project.id)}
                      className="flex items-center gap-2 bg-gray-500/20 border border-gray-500/40 text-gray-400 px-3 py-1 rounded-lg hover:bg-gray-500/30 transition-colors font-mono text-sm"
                    >
                      {expandedProjects.has(project.id) ? (
                        <>
                          <X className="w-4 h-4" />
                          Collapse
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Details
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Details or Edit Mode */}
              {(expandedProjects.has(project.id) ||
                editingProject === project.id) && (
                <div className="p-6">
                  {editingProject === project.id ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold font-mono text-blue-400">
                          Editing Project
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-green-500/20 border border-green-500/40 text-green-400 px-3 py-1 rounded-lg hover:bg-green-500/30 transition-colors font-mono text-sm"
                          >
                            <Save className="w-4 h-4" />
                            Save
                          </button>
                          <button
                            onClick={() => setEditingProject(null)}
                            className="flex items-center gap-2 bg-gray-500/20 border border-gray-500/40 text-gray-400 px-3 py-1 rounded-lg hover:bg-gray-500/30 transition-colors font-mono text-sm"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </div>

                      {/* Edit Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(editData).map(([key, value]) => {
                          if (key === "id") return null;
                          return (
                            <div key={key} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <label className="text-sm font-mono text-gray-300">
                                  {key}
                                </label>
                                <button
                                  onClick={() => handleDeleteField(key)}
                                  className="text-red-400 hover:text-red-300 p-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                              {key === "technologies" &&
                              Array.isArray(value) ? (
                                <div className="space-y-2">
                                  {value.map((tech, index) => (
                                    <div key={index} className="flex gap-2">
                                      <input
                                        type="text"
                                        value={tech}
                                        onChange={(e) => {
                                          const newTechs = [...value];
                                          newTechs[index] = e.target.value;
                                          handleFieldChange(key, newTechs);
                                        }}
                                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-blue-400 focus:outline-none"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newTechs = value.filter(
                                            (_, i) => i !== index
                                          );
                                          handleFieldChange(key, newTechs);
                                        }}
                                        className="bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleFieldChange(key, [...value, ""]);
                                    }}
                                    className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/40 text-blue-400 px-3 py-2 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Technology
                                  </button>
                                </div>
                              ) : key === "projectImg" &&
                                Array.isArray(value) ? (
                                <div className="space-y-2">
                                  {value.map((img, index) => (
                                    <div key={index} className="flex gap-2">
                                      <input
                                        type="text"
                                        value={img}
                                        onChange={(e) => {
                                          const newImgs = [...value];
                                          newImgs[index] = e.target.value;
                                          handleFieldChange(key, newImgs);
                                        }}
                                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-blue-400 focus:outline-none"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newImgs = value.filter(
                                            (_, i) => i !== index
                                          );
                                          handleFieldChange(key, newImgs);
                                        }}
                                        className="bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleFieldChange(key, [...value, ""]);
                                    }}
                                    className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/40 text-blue-400 px-3 py-2 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Image
                                  </button>
                                </div>
                              ) : key === "teamMembers" &&
                                Array.isArray(value) ? (
                                <div className="space-y-3">
                                  {value.map((member, index) => (
                                    <div
                                      key={index}
                                      className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 space-y-2"
                                    >
                                      <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-400 font-mono">
                                          Member {index + 1}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const newMembers = value.filter(
                                              (_, i) => i !== index
                                            );
                                            handleFieldChange(key, newMembers);
                                          }}
                                          className="text-red-400 hover:text-red-300 p-1"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                      <div className="grid grid-cols-1 gap-2">
                                        <input
                                          type="text"
                                          value={member.member || ""}
                                          onChange={(e) => {
                                            const newMembers = [...value];
                                            newMembers[index] = {
                                              ...member,
                                              member: e.target.value,
                                            };
                                            handleFieldChange(key, newMembers);
                                          }}
                                          placeholder="Member name"
                                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-blue-400 focus:outline-none"
                                        />
                                        <input
                                          type="text"
                                          value={member.linkedinId || ""}
                                          onChange={(e) => {
                                            const newMembers = [...value];
                                            newMembers[index] = {
                                              ...member,
                                              linkedinId: e.target.value,
                                            };
                                            handleFieldChange(key, newMembers);
                                          }}
                                          placeholder="LinkedIn URL"
                                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-blue-400 focus:outline-none"
                                        />
                                      </div>
                                    </div>
                                  ))}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleFieldChange(key, [
                                        ...value,
                                        { member: "", linkedinId: "" },
                                      ]);
                                    }}
                                    className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/40 text-blue-400 px-3 py-2 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add Team Member
                                  </button>
                                </div>
                              ) : (
                                <textarea
                                  value={
                                    typeof value === "object"
                                      ? JSON.stringify(value, null, 2)
                                      : value
                                  }
                                  onChange={(e) => {
                                    let newValue = e.target.value;
                                    try {
                                      if (
                                        newValue.startsWith("{") ||
                                        newValue.startsWith("[")
                                      ) {
                                        newValue = JSON.parse(newValue);
                                      }
                                    } catch {}
                                    handleFieldChange(key, newValue);
                                  }}
                                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-blue-400 focus:outline-none resize-none"
                                  rows={3}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Add New Field */}
                      <div className="border-t border-gray-700 pt-4">
                        <h4 className="text-sm font-mono text-gray-300 mb-3">
                          Add New Field
                        </h4>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Field name"
                            value={newField.key}
                            onChange={(e) =>
                              setNewField((prev) => ({
                                ...prev,
                                key: e.target.value,
                              }))
                            }
                            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-blue-400 focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Field value"
                            value={newField.value}
                            onChange={(e) =>
                              setNewField((prev) => ({
                                ...prev,
                                value: e.target.value,
                              }))
                            }
                            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-blue-400 focus:outline-none"
                          />
                          <button
                            onClick={handleAddField}
                            className="bg-blue-500/20 border border-blue-500/40 text-blue-400 px-3 py-2 rounded-lg hover:bg-blue-500/30 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // View Mode - All Details
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(project).map(([key, value]) => {
                        if (key === "id") return null;
                        return (
                          <div
                            key={key}
                            className="bg-gray-800/50 rounded-lg p-3"
                          >
                            <div className="text-xs text-gray-400 font-mono mb-1">
                              {key}
                            </div>
                            <div className="text-sm text-white font-mono break-words">
                              {typeof value === "object"
                                ? JSON.stringify(value, null, 2)
                                : String(value)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 font-mono">No projects found</p>
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold font-mono text-green-400">
                Add New Project
              </h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(newProjectData).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <label className="text-sm font-mono text-gray-300 capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </label>
                    {key === "description" ? (
                      <textarea
                        value={value}
                        onChange={(e) =>
                          handleNewProjectFieldChange(key, e.target.value)
                        }
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-green-400 focus:outline-none resize-none"
                        rows={4}
                      />
                    ) : key === "status" ? (
                      <select
                        value={value}
                        onChange={(e) =>
                          handleNewProjectFieldChange(key, e.target.value)
                        }
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-green-400 focus:outline-none"
                      >
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="on_hold">On Hold</option>
                      </select>
                    ) : key === "technologies" ? (
                      <div className="space-y-2">
                        {value.map((tech, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={tech}
                              onChange={(e) => {
                                const newTechs = [...value];
                                newTechs[index] = e.target.value;
                                handleNewProjectFieldChange(key, newTechs);
                              }}
                              placeholder="Technology name"
                              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-green-400 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newTechs = value.filter(
                                  (_, i) => i !== index
                                );
                                handleNewProjectFieldChange(key, newTechs);
                              }}
                              className="bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            handleNewProjectFieldChange(key, [...value, ""]);
                          }}
                          className="flex items-center gap-2 bg-green-500/20 border border-green-500/40 text-green-400 px-3 py-2 rounded-lg hover:bg-green-500/30 transition-colors text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          Add Technology
                        </button>
                      </div>
                    ) : key === "projectImg" ? (
                      <div className="space-y-2">
                        {value.map((img, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={img}
                              onChange={(e) => {
                                const newImgs = [...value];
                                newImgs[index] = e.target.value;
                                handleNewProjectFieldChange(key, newImgs);
                              }}
                              placeholder="Image URL"
                              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-green-400 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newImgs = value.filter(
                                  (_, i) => i !== index
                                );
                                handleNewProjectFieldChange(key, newImgs);
                              }}
                              className="bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            handleNewProjectFieldChange(key, [...value, ""]);
                          }}
                          className="flex items-center gap-2 bg-green-500/20 border border-green-500/40 text-green-400 px-3 py-2 rounded-lg hover:bg-green-500/30 transition-colors text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          Add Image
                        </button>
                      </div>
                    ) : key === "teamMembers" ? (
                      <div className="space-y-3">
                        {value.map((member, index) => (
                          <div
                            key={index}
                            className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 space-y-2"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-400 font-mono">
                                Member {index + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newMembers = value.filter(
                                    (_, i) => i !== index
                                  );
                                  handleNewProjectFieldChange(key, newMembers);
                                }}
                                className="text-red-400 hover:text-red-300 p-1"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                              <input
                                type="text"
                                value={member.member || ""}
                                onChange={(e) => {
                                  const newMembers = [...value];
                                  newMembers[index] = {
                                    ...member,
                                    member: e.target.value,
                                  };
                                  handleNewProjectFieldChange(key, newMembers);
                                }}
                                placeholder="Member name"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-green-400 focus:outline-none"
                              />
                              <input
                                type="text"
                                value={member.linkedinId || ""}
                                onChange={(e) => {
                                  const newMembers = [...value];
                                  newMembers[index] = {
                                    ...member,
                                    linkedinId: e.target.value,
                                  };
                                  handleNewProjectFieldChange(key, newMembers);
                                }}
                                placeholder="LinkedIn URL"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-green-400 focus:outline-none"
                              />
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            handleNewProjectFieldChange(key, [
                              ...value,
                              { member: "", linkedinId: "" },
                            ]);
                          }}
                          className="flex items-center gap-2 bg-green-500/20 border border-green-500/40 text-green-400 px-3 py-2 rounded-lg hover:bg-green-500/30 transition-colors text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          Add Team Member
                        </button>
                      </div>
                    ) : (
                      <input
                        type={
                          key === "date"
                            ? "date"
                            : key === "progress"
                            ? "number"
                            : "text"
                        }
                        value={value}
                        onChange={(e) =>
                          handleNewProjectFieldChange(key, e.target.value)
                        }
                        min={key === "progress" ? "0" : undefined}
                        max={key === "progress" ? "100" : undefined}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-green-400 focus:outline-none"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleAddProject}
                  className="flex items-center gap-2 bg-green-500/20 border border-green-500/40 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-colors font-mono"
                >
                  <Plus className="w-4 h-4" />
                  Add Project
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex items-center gap-2 bg-gray-500/20 border border-gray-500/40 text-gray-400 px-4 py-2 rounded-lg hover:bg-gray-500/30 transition-colors font-mono"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
