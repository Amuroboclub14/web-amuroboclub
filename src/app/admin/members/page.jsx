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
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

export default function MembersManagement() {
  const router = useRouter();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState(null);
  const [editData, setEditData] = useState({});
  const [newField, setNewField] = useState({ key: "", value: "" });
  const [expandedMembers, setExpandedMembers] = useState(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMemberData, setNewMemberData] = useState({
    name: "",
    email: "",
    mobile: "",
    course: "",
    enrollmentNumber: "",
    facultyNumber: "",
    discordId: "",
    idProofURL: "",
    paymentProofURL: "",
    paymentStatus: false,
    submittedTimestamp: Date.now(),
    recaptchaToken: "",
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const result = await getAllDocuments("members_2025");
      if (result.success) {
        setMembers(result.data);
      } else {
        console.error("Error fetching members:", result.error);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member.id);
    setEditData({ ...member });
    setNewField({ key: "", value: "" });
  };

  const handleSave = async () => {
    try {
      const { id, createdAt, updatedAt, ...dataToUpdate } = editData;
      const result = await updateDocument(
        "members_2025",
        editingMember,
        dataToUpdate
      );

      if (result.success) {
        await fetchMembers();
        setEditingMember(null);
        setEditData({});
      } else {
        console.error("Error updating member:", result.error);
        alert("Failed to update member: " + result.error);
      }
    } catch (error) {
      console.error("Error updating member:", error);
      alert("Error updating member: " + error.message);
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
          "members_2025",
          editingMember,
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
        "members_2025",
        editingMember,
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

  const toggleExpand = (memberId) => {
    const newExpanded = new Set(expandedMembers);
    if (newExpanded.has(memberId)) {
      newExpanded.delete(memberId);
    } else {
      newExpanded.add(memberId);
    }
    setExpandedMembers(newExpanded);
  };

  const handleDeleteMember = async (memberId, memberName) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${memberName}"? This action cannot be undone.`
      )
    ) {
      try {
        const result = await deleteDocument("members_2025", memberId);

        if (result.success) {
          await fetchMembers();
          alert("Member deleted successfully");
        } else {
          console.error("Error deleting member:", result.error);
          alert("Failed to delete member: " + result.error);
        }
      } catch (error) {
        console.error("Error deleting member:", error);
        alert("Error deleting member: " + error.message);
      }
    }
  };

  const handleAddMember = async () => {
    try {
      const result = await createDocument("members_2025", newMemberData);

      if (result.success) {
        await fetchMembers();
        setShowAddForm(false);
        setNewMemberData({
          name: "",
          email: "",
          mobile: "",
          course: "",
          enrollmentNumber: "",
          facultyNumber: "",
          discordId: "",
          idProofURL: "",
          paymentProofURL: "",
          paymentStatus: false,
          submittedTimestamp: Date.now(),
          recaptchaToken: "",
        });
        alert("Member added successfully!");
      } else {
        console.error("Error adding member:", result.error);
        alert("Failed to add member: " + result.error);
      }
    } catch (error) {
      console.error("Error adding member:", error);
      alert("Error adding member: " + error.message);
    }
  };

  const handleNewMemberFieldChange = (key, value) => {
    setNewMemberData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      const date = new Date(timestamp);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400 font-mono">Loading members...</p>
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
                <Users className="w-6 h-6 text-blue-400" />
                <h1 className="text-2xl font-bold font-mono">
                  Members Management
                </h1>
              </div>
            </div>

            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-green-500/20 border border-green-500/40 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-colors font-mono"
            >
              <Plus className="w-5 h-5" />
              Add Member
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center gap-6">
          <p className="text-gray-400 font-mono">
            Total Members: {members.length}
          </p>
          <p className="text-gray-400 font-mono">
            Paid Members:{" "}
            {members.filter((m) => m.paymentStatus === true).length}
          </p>
          <p className="text-gray-400 font-mono">
            Pending Payment:{" "}
            {members.filter((m) => m.paymentStatus === false).length}
          </p>
        </div>

        {/* Members List */}
        <div className="space-y-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden"
            >
              {/* Compact Card Header */}
              <div className="p-4 border-b border-gray-800">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold font-mono text-white mb-1">
                      {member.name || "Unnamed Member"}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400 font-mono">
                      <span>ID: {member.id}</span>
                      <span>{member.email}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(member.submittedTimestamp)}
                      </span>
                      <span
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                          member.paymentStatus
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {member.paymentStatus ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Paid
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            Pending
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(member)}
                      className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/40 text-blue-400 px-3 py-1 rounded-lg hover:bg-blue-500/30 transition-colors font-mono text-sm"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteMember(
                          member.id,
                          member.name || "Unnamed Member"
                        )
                      }
                      className="flex items-center gap-2 bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-1 rounded-lg hover:bg-red-500/30 transition-colors font-mono text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>

                    <button
                      onClick={() => toggleExpand(member.id)}
                      className="flex items-center gap-2 bg-gray-500/20 border border-gray-500/40 text-gray-400 px-3 py-1 rounded-lg hover:bg-gray-500/30 transition-colors font-mono text-sm"
                    >
                      {expandedMembers.has(member.id) ? (
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
              {(expandedMembers.has(member.id) ||
                editingMember === member.id) && (
                <div className="p-6">
                  {editingMember === member.id ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold font-mono text-blue-400">
                          Editing Member
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
                            onClick={() => setEditingMember(null)}
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
                              {key === "paymentStatus" ? (
                                <select
                                  value={value.toString()}
                                  onChange={(e) =>
                                    handleFieldChange(
                                      key,
                                      e.target.value === "true"
                                    )
                                  }
                                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-blue-400 focus:outline-none"
                                >
                                  <option value="false">Pending</option>
                                  <option value="true">Paid</option>
                                </select>
                              ) : key === "submittedTimestamp" ? (
                                <input
                                  type="number"
                                  value={value}
                                  onChange={(e) =>
                                    handleFieldChange(
                                      key,
                                      parseInt(e.target.value)
                                    )
                                  }
                                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-blue-400 focus:outline-none"
                                />
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
                      {Object.entries(member).map(([key, value]) => {
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
                              {key === "submittedTimestamp"
                                ? formatDate(value)
                                : key === "paymentStatus"
                                ? value
                                  ? "Paid"
                                  : "Pending"
                                : typeof value === "object"
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

        {members.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 font-mono">No members found</p>
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold font-mono text-green-400">
                Add New Member
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
                {Object.entries(newMemberData).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <label className="text-sm font-mono text-gray-300 capitalize">
                      {key.replace(/([A-Z])/g, " $1")}{" "}
                      {key === "paymentProofURL" ? "(Optional)" : ""}
                    </label>
                    {key === "paymentStatus" ? (
                      <select
                        value={value.toString()}
                        onChange={(e) =>
                          handleNewMemberFieldChange(
                            key,
                            e.target.value === "true"
                          )
                        }
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-green-400 focus:outline-none"
                      >
                        <option value="false">Pending</option>
                        <option value="true">Paid</option>
                      </select>
                    ) : key === "course" ? (
                      <select
                        value={value}
                        onChange={(e) =>
                          handleNewMemberFieldChange(key, e.target.value)
                        }
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-green-400 focus:outline-none"
                      >
                        <option value="">Select Course</option>
                        <option value="B.Tech">B.Tech</option>
                        <option value="B.Sc.">B.Sc.</option>
                        <option value="BCA">BCA</option>
                        <option value="M.Sc.">M.Sc.</option>
                        <option value="M.Tech.">M.Tech.</option>
                        <option value="Polytechnic">Polytechnic</option>
                      </select>
                    ) : key === "submittedTimestamp" ? (
                      <input
                        type="number"
                        value={value}
                        onChange={(e) =>
                          handleNewMemberFieldChange(
                            key,
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-green-400 focus:outline-none"
                      />
                    ) : (
                      <input
                        type={key === "email" ? "email" : "text"}
                        value={value}
                        onChange={(e) =>
                          handleNewMemberFieldChange(key, e.target.value)
                        }
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-green-400 focus:outline-none"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleAddMember}
                  className="flex items-center gap-2 bg-green-500/20 border border-green-500/40 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-colors font-mono"
                >
                  <Plus className="w-4 h-4" />
                  Add Member
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
