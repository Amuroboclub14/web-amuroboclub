"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase";
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
  Users,
  Calendar,
  User,
  Mail,
  MapPin,
  Hash,
  Image as ImageIcon,
  Link,
} from "lucide-react";

export default function TeamsManagement() {
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTeam, setEditingTeam] = useState(null);
  const [editData, setEditData] = useState({});
  const [newField, setNewField] = useState({ key: "", value: "" });
  const [expandedTeams, setExpandedTeams] = useState(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTeamData, setNewTeamData] = useState({
    year: "",
    members: [],
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const result = await getAllDocuments("teams");
      if (result.success) {
        // Sort teams by year in descending order
        const sortedTeams = result.data.sort((a, b) => {
          const yearA = a.year || a.id.split("_")[1] || "0000";
          const yearB = b.year || b.id.split("_")[1] || "0000";
          return yearB.localeCompare(yearA);
        });
        setTeams(sortedTeams);
      } else {
        console.error("Error fetching teams:", result.error);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (team) => {
    setEditingTeam(team.id);
    setEditData({ ...team });
    setNewField({ key: "", value: "" });
  };

  const handleSave = async () => {
    try {
      const { id, createdAt, updatedAt, ...dataToUpdate } = editData;
      const result = await updateDocument("teams", editingTeam, dataToUpdate);

      if (result.success) {
        await fetchTeams();
        setEditingTeam(null);
        setEditData({});
      } else {
        console.error("Error updating team:", result.error);
        alert("Failed to update team: " + result.error);
      }
    } catch (error) {
      console.error("Error updating team:", error);
      alert("Error updating team: " + error.message);
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
          "teams",
          editingTeam,
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
        "teams",
        editingTeam,
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

  const toggleExpand = (teamId) => {
    const newExpanded = new Set(expandedTeams);
    if (newExpanded.has(teamId)) {
      newExpanded.delete(teamId);
    } else {
      newExpanded.add(teamId);
    }
    setExpandedTeams(newExpanded);
  };

  const handleDeleteTeam = async (teamId, teamYear) => {
    if (
      window.confirm(
        `Are you sure you want to delete team "${teamYear}"? This action cannot be undone.`
      )
    ) {
      try {
        const result = await deleteDocument("teams", teamId);

        if (result.success) {
          await fetchTeams();
          alert("Team deleted successfully");
        } else {
          console.error("Error deleting team:", result.error);
          alert("Failed to delete team: " + result.error);
        }
      } catch (error) {
        console.error("Error deleting team:", error);
        alert("Error deleting team: " + error.message);
      }
    }
  };

  const handleAddTeam = async () => {
    try {
      const result = await createDocument("teams", newTeamData);

      if (result.success) {
        await fetchTeams();
        setShowAddForm(false);
        setNewTeamData({
          year: "",
          members: [],
        });
        alert("Team added successfully!");
      } else {
        console.error("Error adding team:", result.error);
        alert("Failed to add team: " + result.error);
      }
    } catch (error) {
      console.error("Error adding team:", error);
      alert("Error adding team: " + error.message);
    }
  };

  const handleNewTeamFieldChange = (key, value) => {
    setNewTeamData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const createEmptyMember = () => ({
    name: "",
    email: "",
    position: "",
    profileImageUrl: "",
    rank: "",
    links: {
      github: "",
      linkedin: "",
      twitter: "",
      instagram: "",
      portfolio: "",
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-400 font-mono">Loading teams...</p>
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
                <Users className="w-6 h-6 text-purple-400" />
                <h1 className="text-2xl font-bold font-mono">
                  Teams Management
                </h1>
              </div>
            </div>

            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-green-500/20 border border-green-500/40 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-colors font-mono"
            >
              <Plus className="w-5 h-5" />
              Add Team Year
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-gray-400 font-mono">
            Total Team Years: {teams.length}
          </p>
        </div>

        {/* Teams List */}
        <div className="space-y-4">
          {teams.map((team) => (
            <div
              key={team.id}
              className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden"
            >
              {/* Compact Card Header */}
              <div className="p-4 border-b border-gray-800">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold font-mono text-white mb-1">
                      Team {team.year || team.id}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400 font-mono">
                      <span>ID: {team.id}</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {team.members?.length || 0} Members
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {team.year || "Year not set"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(team)}
                      className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/40 text-blue-400 px-3 py-1 rounded-lg hover:bg-blue-500/30 transition-colors font-mono text-sm"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteTeam(team.id, team.year || team.id)
                      }
                      className="flex items-center gap-2 bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-1 rounded-lg hover:bg-red-500/30 transition-colors font-mono text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>

                    <button
                      onClick={() => toggleExpand(team.id)}
                      className="flex items-center gap-2 bg-gray-500/20 border border-gray-500/40 text-gray-400 px-3 py-1 rounded-lg hover:bg-gray-500/30 transition-colors font-mono text-sm"
                    >
                      {expandedTeams.has(team.id) ? (
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
              {(expandedTeams.has(team.id) || editingTeam === team.id) && (
                <div className="p-6">
                  {editingTeam === team.id ? (
                    // Edit Mode
                    <div className="space-y-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold font-mono text-blue-400">
                          Editing Team {team.year || team.id}
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
                            onClick={() => setEditingTeam(null)}
                            className="flex items-center gap-2 bg-gray-500/20 border border-gray-500/40 text-gray-400 px-3 py-1 rounded-lg hover:bg-gray-500/30 transition-colors font-mono text-sm"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </div>

                      {/* Basic Team Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {Object.entries(editData).map(([key, value]) => {
                          if (key === "id" || key === "members") return null;
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
                              <input
                                type="text"
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
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-blue-400 focus:outline-none"
                              />
                            </div>
                          );
                        })}
                      </div>

                      {/* Members Section */}
                      <div className="border-t border-gray-700 pt-6">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-lg font-mono text-purple-400">
                            Team Members
                          </h4>
                          <button
                            onClick={() => {
                              const newMembers = [
                                ...(editData.members || []),
                                createEmptyMember(),
                              ];
                              handleFieldChange("members", newMembers);
                            }}
                            className="flex items-center gap-2 bg-purple-500/20 border border-purple-500/40 text-purple-400 px-3 py-2 rounded-lg hover:bg-purple-500/30 transition-colors text-sm"
                          >
                            <Plus className="w-4 h-4" />
                            Add Member
                          </button>
                        </div>

                        <div className="space-y-4">
                          {(editData.members || []).map((member, index) => (
                            <div
                              key={index}
                              className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
                            >
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-sm text-purple-400 font-mono">
                                  Member {index + 1}: {member.name || "Unnamed"}
                                </span>
                                <button
                                  onClick={() => {
                                    const newMembers = editData.members.filter(
                                      (_, i) => i !== index
                                    );
                                    handleFieldChange("members", newMembers);
                                  }}
                                  className="text-red-400 hover:text-red-300 p-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {/* Basic Info */}
                                <div className="space-y-2">
                                  <label className="text-xs text-gray-400 font-mono flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    Name
                                  </label>
                                  <input
                                    type="text"
                                    value={member.name || ""}
                                    onChange={(e) => {
                                      const newMembers = [...editData.members];
                                      newMembers[index] = {
                                        ...member,
                                        name: e.target.value,
                                      };
                                      handleFieldChange("members", newMembers);
                                    }}
                                    className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm font-mono text-white focus:border-purple-400 focus:outline-none"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label className="text-xs text-gray-400 font-mono flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    Email
                                  </label>
                                  <input
                                    type="email"
                                    value={member.email || ""}
                                    onChange={(e) => {
                                      const newMembers = [...editData.members];
                                      newMembers[index] = {
                                        ...member,
                                        email: e.target.value,
                                      };
                                      handleFieldChange("members", newMembers);
                                    }}
                                    className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm font-mono text-white focus:border-purple-400 focus:outline-none"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label className="text-xs text-gray-400 font-mono flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    Position
                                  </label>
                                  <input
                                    type="text"
                                    value={member.position || ""}
                                    onChange={(e) => {
                                      const newMembers = [...editData.members];
                                      newMembers[index] = {
                                        ...member,
                                        position: e.target.value,
                                      };
                                      handleFieldChange("members", newMembers);
                                    }}
                                    className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm font-mono text-white focus:border-purple-400 focus:outline-none"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label className="text-xs text-gray-400 font-mono flex items-center gap-1">
                                    <Hash className="w-3 h-3" />
                                    Rank
                                  </label>
                                  <input
                                    type="text"
                                    value={member.rank || ""}
                                    onChange={(e) => {
                                      const newMembers = [...editData.members];
                                      newMembers[index] = {
                                        ...member,
                                        rank: e.target.value,
                                      };
                                      handleFieldChange("members", newMembers);
                                    }}
                                    className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm font-mono text-white focus:border-purple-400 focus:outline-none"
                                  />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                  <label className="text-xs text-gray-400 font-mono flex items-center gap-1">
                                    <ImageIcon className="w-3 h-3" />
                                    Profile Image URL
                                  </label>
                                  <input
                                    type="url"
                                    value={member.profileImageUrl || ""}
                                    onChange={(e) => {
                                      const newMembers = [...editData.members];
                                      newMembers[index] = {
                                        ...member,
                                        profileImageUrl: e.target.value,
                                      };
                                      handleFieldChange("members", newMembers);
                                    }}
                                    className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm font-mono text-white focus:border-purple-400 focus:outline-none"
                                  />
                                </div>
                              </div>

                              {/* Links Section */}
                              <div className="mt-4 pt-3 border-t border-gray-600">
                                <label className="text-xs text-gray-400 font-mono flex items-center gap-1 mb-2">
                                  <Link className="w-3 h-3" />
                                  Social Links (Optional)
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                  {[
                                    "github",
                                    "linkedin",
                                    "twitter",
                                    "instagram",
                                    "portfolio",
                                  ].map((linkType) => (
                                    <div key={linkType} className="space-y-1">
                                      <label className="text-xs text-gray-500 font-mono capitalize">
                                        {linkType}
                                      </label>
                                      <input
                                        type="url"
                                        value={member.links?.[linkType] || ""}
                                        onChange={(e) => {
                                          const newMembers = [
                                            ...editData.members,
                                          ];
                                          newMembers[index] = {
                                            ...member,
                                            links: {
                                              ...member.links,
                                              [linkType]: e.target.value,
                                            },
                                          };
                                          handleFieldChange(
                                            "members",
                                            newMembers
                                          );
                                        }}
                                        placeholder={`${linkType} URL`}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs font-mono text-white focus:border-purple-400 focus:outline-none"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // View Mode - All Details
                    <div className="space-y-6">
                      {/* Basic Team Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(team).map(([key, value]) => {
                          if (key === "id" || key === "members") return null;
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

                      {/* Members Display */}
                      {team.members && team.members.length > 0 && (
                        <div className="border-t border-gray-700 pt-6">
                          <h4 className="text-lg font-mono text-purple-400 mb-4">
                            Team Members ({team.members.length})
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {team.members.map((member, index) => (
                              <div
                                key={index}
                                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
                              >
                                <div className="space-y-2">
                                  <h5 className="font-mono text-white font-semibold">
                                    {member.name || "Unnamed Member"}
                                  </h5>
                                  <div className="text-xs text-gray-400 space-y-1">
                                    {member.position && (
                                      <div className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {member.position}
                                      </div>
                                    )}
                                    {member.email && (
                                      <div className="flex items-center gap-1">
                                        <Mail className="w-3 h-3" />
                                        {member.email}
                                      </div>
                                    )}
                                    {member.rank && (
                                      <div className="flex items-center gap-1">
                                        <Hash className="w-3 h-3" />
                                        Rank: {member.rank}
                                      </div>
                                    )}
                                  </div>
                                  {member.links &&
                                    Object.values(member.links).some(
                                      (link) => link
                                    ) && (
                                      <div className="pt-2 border-t border-gray-600">
                                        <div className="text-xs text-gray-500 mb-1">
                                          Links:
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                          {Object.entries(member.links).map(
                                            ([type, url]) =>
                                              url ? (
                                                <span
                                                  key={type}
                                                  className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded"
                                                >
                                                  {type}
                                                </span>
                                              ) : null
                                          )}
                                        </div>
                                      </div>
                                    )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {teams.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 font-mono">No teams found</p>
          </div>
        )}
      </div>

      {/* Add Team Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold font-mono text-green-400">
                Add New Team Year
              </h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-mono text-gray-300">
                  Academic Year (e.g., "2025-26")
                </label>
                <input
                  type="text"
                  value={newTeamData.year}
                  onChange={(e) =>
                    handleNewTeamFieldChange("year", e.target.value)
                  }
                  placeholder="2025-26"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-green-400 focus:outline-none"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-mono text-gray-300">
                    Team Members
                  </label>
                  <button
                    onClick={() => {
                      const newMembers = [
                        ...newTeamData.members,
                        createEmptyMember(),
                      ];
                      handleNewTeamFieldChange("members", newMembers);
                    }}
                    className="flex items-center gap-2 bg-purple-500/20 border border-purple-500/40 text-purple-400 px-3 py-1 rounded-lg hover:bg-purple-500/30 transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Member
                  </button>
                </div>

                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {newTeamData.members.map((member, index) => (
                    <div
                      key={index}
                      className="bg-gray-800/50 border border-gray-700 rounded-lg p-3"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-purple-400 font-mono">
                          Member {index + 1}
                        </span>
                        <button
                          onClick={() => {
                            const newMembers = newTeamData.members.filter(
                              (_, i) => i !== index
                            );
                            handleNewTeamFieldChange("members", newMembers);
                          }}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <input
                          type="text"
                          value={member.name || ""}
                          onChange={(e) => {
                            const newMembers = [...newTeamData.members];
                            newMembers[index] = {
                              ...member,
                              name: e.target.value,
                            };
                            handleNewTeamFieldChange("members", newMembers);
                          }}
                          placeholder="Name"
                          className="bg-gray-800 border border-gray-700 rounded px-2 py-1 font-mono text-white focus:border-purple-400 focus:outline-none"
                        />
                        <input
                          type="email"
                          value={member.email || ""}
                          onChange={(e) => {
                            const newMembers = [...newTeamData.members];
                            newMembers[index] = {
                              ...member,
                              email: e.target.value,
                            };
                            handleNewTeamFieldChange("members", newMembers);
                          }}
                          placeholder="Email"
                          className="bg-gray-800 border border-gray-700 rounded px-2 py-1 font-mono text-white focus:border-purple-400 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={member.position || ""}
                          onChange={(e) => {
                            const newMembers = [...newTeamData.members];
                            newMembers[index] = {
                              ...member,
                              position: e.target.value,
                            };
                            handleNewTeamFieldChange("members", newMembers);
                          }}
                          placeholder="Position"
                          className="bg-gray-800 border border-gray-700 rounded px-2 py-1 font-mono text-white focus:border-purple-400 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={member.rank || ""}
                          onChange={(e) => {
                            const newMembers = [...newTeamData.members];
                            newMembers[index] = {
                              ...member,
                              rank: e.target.value,
                            };
                            handleNewTeamFieldChange("members", newMembers);
                          }}
                          placeholder="Rank"
                          className="bg-gray-800 border border-gray-700 rounded px-2 py-1 font-mono text-white focus:border-purple-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleAddTeam}
                  className="flex items-center gap-2 bg-green-500/20 border border-green-500/40 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-colors font-mono"
                >
                  <Plus className="w-4 h-4" />
                  Add Team
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
