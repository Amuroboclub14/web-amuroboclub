"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../ProtectedRoute";
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
  GraduationCap,
  User,
  Mail,
  Building,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

function FacultyManagementContent() {
  const router = useRouter();
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [editData, setEditData] = useState({});
  const [newField, setNewField] = useState({ key: "", value: "" });
  const [expandedFaculty, setExpandedFaculty] = useState(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFacultyData, setNewFacultyData] = useState({
    name: "",
    email: "",
    department: "",
    designation: "",
    category: "advisor",
    image: "",
  });

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const result = await getAllDocuments("faculty");
      if (result.success) {
        setFaculty(result.data);
      } else {
        console.error("Error fetching faculty:", result.error);
      }
    } catch (error) {
      console.error("Error fetching faculty:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member) => {
    setEditingFaculty(member.id);
    setEditData({ ...member });
    setNewField({ key: "", value: "" });
  };

  const handleSave = async () => {
    try {
      const { id, createdAt, updatedAt, ...dataToUpdate } = editData;
      const result = await updateDocument(
        "faculty",
        editingFaculty,
        dataToUpdate
      );

      if (result.success) {
        await fetchFaculty();
        setEditingFaculty(null);
        setEditData({});
      } else {
        console.error("Error updating faculty:", result.error);
        alert("Failed to update faculty: " + result.error);
      }
    } catch (error) {
      console.error("Error updating faculty:", error);
      alert("Error updating faculty: " + error.message);
    }
  };

  const handleFieldChange = (key, value) => {
    setEditData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAddField = async () => {
    if (!newField.key.trim()) return;

    try {
      const result = await addFieldToDocument(
        "faculty",
        editingFaculty,
        newField.key,
        newField.value
      );

      if (result.success) {
        await fetchFaculty();
        setNewField({ key: "", value: "" });
        const updatedMember = faculty.find((m) => m.id === editingFaculty);
        setEditData({ ...updatedMember, [newField.key]: newField.value });
      } else {
        console.error("Error adding field:", result.error);
        alert("Failed to add field: " + result.error);
      }
    } catch (error) {
      console.error("Error adding field:", error);
      alert("Error adding field: " + error.message);
    }
  };

  const handleDeleteField = async (fieldKey) => {
    if (
      window.confirm(`Are you sure you want to delete the field "${fieldKey}"?`)
    ) {
      try {
        const result = await deleteFieldFromDocument(
          "faculty",
          editingFaculty,
          fieldKey
        );

        if (result.success) {
          await fetchFaculty();
          const { [fieldKey]: deleted, ...rest } = editData;
          setEditData(rest);
        } else {
          console.error("Error deleting field:", result.error);
          alert("Failed to delete field: " + result.error);
        }
      } catch (error) {
        console.error("Error deleting field:", error);
        alert("Error deleting field: " + error.message);
      }
    }
  };

  const handleDeleteFaculty = async (facultyId, facultyName) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${facultyName}"? This action cannot be undone.`
      )
    ) {
      try {
        const result = await deleteDocument("faculty", facultyId);

        if (result.success) {
          await fetchFaculty();
          alert("Faculty member deleted successfully");
        } else {
          console.error("Error deleting faculty:", result.error);
          alert("Failed to delete faculty: " + result.error);
        }
      } catch (error) {
        console.error("Error deleting faculty:", error);
        alert("Error deleting faculty: " + error.message);
      }
    }
  };

  const handleAddFaculty = async () => {
    try {
      const result = await createDocument("faculty", newFacultyData);

      if (result.success) {
        await fetchFaculty();
        setShowAddForm(false);
        setNewFacultyData({
          name: "",
          email: "",
          department: "",
          designation: "",
          category: "advisor",
          image: "",
        });
        alert("Faculty member added successfully!");
      } else {
        console.error("Error adding faculty:", result.error);
        alert("Failed to add faculty: " + result.error);
      }
    } catch (error) {
      console.error("Error adding faculty:", error);
      alert("Error adding faculty: " + error.message);
    }
  };

  const handleNewFacultyFieldChange = (key, value) => {
    setNewFacultyData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleExpanded = (facultyId) => {
    const newExpanded = new Set(expandedFaculty);
    if (newExpanded.has(facultyId)) {
      newExpanded.delete(facultyId);
    } else {
      newExpanded.add(facultyId);
    }
    setExpandedFaculty(newExpanded);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "incharge":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
      case "advisor":
        return "text-blue-400 bg-blue-400/10 border-blue-400/30";
      case "patron":
        return "text-green-400 bg-green-400/10 border-green-400/30";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/30";
    }
  };

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
                <GraduationCap className="w-6 h-6 text-blue-400" />
                <h1 className="text-2xl font-bold font-mono">
                  Faculty Management
                </h1>
              </div>
            </div>

            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-green-500/20 border border-green-500/40 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-colors font-mono"
            >
              <Plus className="w-4 h-4" />
              Add Faculty
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            <p className="mt-4 text-gray-400 font-mono">Loading faculty...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {faculty.map((member) => (
              <div
                key={member.id}
                className="bg-gray-900/50 border border-gray-700/50 rounded-xl backdrop-blur-lg"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800 border-2 border-gray-600">
                        {member.image ? (
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-8 h-8 text-gray-500" />
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="text-xl font-bold font-mono text-white">
                          {member.name || "Unnamed Faculty"}
                        </h3>
                        <p className="text-gray-400 font-mono text-sm">
                          {member.designation || "No designation"}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-mono border ${getCategoryColor(
                              member.category
                            )}`}
                          >
                            {member.category || "advisor"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleExpanded(member.id)}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        {expandedFaculty.has(member.id) ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>

                      <button
                        onClick={() => handleEdit(member)}
                        className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/40 text-blue-400 px-3 py-1 rounded-lg hover:bg-blue-500/30 transition-colors font-mono text-sm"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteFaculty(
                            member.id,
                            member.name || "Unnamed Faculty"
                          )
                        }
                        className="flex items-center gap-2 bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-1 rounded-lg hover:bg-red-500/30 transition-colors font-mono text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedFaculty.has(member.id) && (
                    <div className="mt-6 pt-6 border-t border-gray-700/50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 bg-gray-800/30 rounded-lg p-3">
                          <Mail className="w-5 h-5 text-purple-400" />
                          <span className="text-white font-mono text-sm">
                            {member.email || "No email"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-800/30 rounded-lg p-3">
                          <Building className="w-5 h-5 text-blue-400" />
                          <span className="text-white font-mono text-sm">
                            {member.department || "No department"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Edit Form */}
                {editingFaculty === member.id && (
                  <div className="border-t border-gray-700/50 p-6 bg-gray-800/30">
                    <h4 className="text-lg font-bold font-mono text-white mb-4">
                      Edit Faculty Member
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-mono text-gray-400 mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          value={editData.name || ""}
                          onChange={(e) =>
                            handleFieldChange("name", e.target.value)
                          }
                          className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-blue-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-mono text-gray-400 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={editData.email || ""}
                          onChange={(e) =>
                            handleFieldChange("email", e.target.value)
                          }
                          className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-blue-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-mono text-gray-400 mb-2">
                          Department
                        </label>
                        <input
                          type="text"
                          value={editData.department || ""}
                          onChange={(e) =>
                            handleFieldChange("department", e.target.value)
                          }
                          className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-blue-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-mono text-gray-400 mb-2">
                          Designation
                        </label>
                        <input
                          type="text"
                          value={editData.designation || ""}
                          onChange={(e) =>
                            handleFieldChange("designation", e.target.value)
                          }
                          className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-blue-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-mono text-gray-400 mb-2">
                          Category
                        </label>
                        <select
                          value={editData.category || "advisor"}
                          onChange={(e) =>
                            handleFieldChange("category", e.target.value)
                          }
                          className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-blue-400 focus:outline-none"
                        >
                          <option value="advisor">Advisor</option>
                          <option value="incharge">In Charge</option>
                          <option value="patron">Patron</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-mono text-gray-400 mb-2">
                          Image URL
                        </label>
                        <input
                          type="url"
                          value={editData.image || ""}
                          onChange={(e) =>
                            handleFieldChange("image", e.target.value)
                          }
                          className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-blue-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Add Custom Field */}
                    <div className="mb-6 p-4 bg-gray-900/30 rounded-lg border border-gray-600/50">
                      <h5 className="text-sm font-mono text-gray-400 mb-3">
                        Add Custom Field
                      </h5>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Field name"
                          value={newField.key}
                          onChange={(e) =>
                            setNewField({ ...newField, key: e.target.value })
                          }
                          className="flex-1 bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-blue-400 focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Field value"
                          value={newField.value}
                          onChange={(e) =>
                            setNewField({ ...newField, value: e.target.value })
                          }
                          className="flex-1 bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-blue-400 focus:outline-none"
                        />
                        <button
                          onClick={handleAddField}
                          className="bg-green-500/20 border border-green-500/40 text-green-400 px-3 py-2 rounded-lg hover:bg-green-500/30 transition-colors font-mono text-sm"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* All Fields */}
                    <div className="mb-6">
                      <h5 className="text-sm font-mono text-gray-400 mb-3">
                        All Fields
                      </h5>
                      <div className="space-y-2">
                        {Object.entries(editData)
                          .filter(
                            ([key]) =>
                              !["id", "createdAt", "updatedAt"].includes(key)
                          )
                          .map(([key, value]) => (
                            <div
                              key={key}
                              className="flex items-center gap-2 bg-gray-900/30 rounded-lg p-3"
                            >
                              <span className="text-blue-400 font-mono text-sm min-w-0 flex-shrink-0">
                                {key}:
                              </span>
                              <span className="text-white font-mono text-sm flex-1 min-w-0 break-all">
                                {typeof value === "object"
                                  ? JSON.stringify(value)
                                  : String(value)}
                              </span>
                              <button
                                onClick={() => handleDeleteField(key)}
                                className="text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-green-500/20 border border-green-500/40 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-colors font-mono"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                      <button
                        onClick={() => {
                          setEditingFaculty(null);
                          setEditData({});
                        }}
                        className="flex items-center gap-2 bg-gray-500/20 border border-gray-500/40 text-gray-400 px-4 py-2 rounded-lg hover:bg-gray-500/30 transition-colors font-mono"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {faculty.length === 0 && (
              <div className="text-center py-12">
                <GraduationCap className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 font-mono text-lg">
                  No faculty members found
                </p>
                <p className="text-gray-600 font-mono text-sm mt-2">
                  Add your first faculty member to get started
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Faculty Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold font-mono text-white mb-6">
              Add New Faculty Member
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-mono text-gray-400 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={newFacultyData.name}
                  onChange={(e) =>
                    handleNewFacultyFieldChange("name", e.target.value)
                  }
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-blue-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-mono text-gray-400 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={newFacultyData.email}
                  onChange={(e) =>
                    handleNewFacultyFieldChange("email", e.target.value)
                  }
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-blue-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-mono text-gray-400 mb-2">
                  Department *
                </label>
                <input
                  type="text"
                  value={newFacultyData.department}
                  onChange={(e) =>
                    handleNewFacultyFieldChange("department", e.target.value)
                  }
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-blue-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-mono text-gray-400 mb-2">
                  Designation *
                </label>
                <input
                  type="text"
                  value={newFacultyData.designation}
                  onChange={(e) =>
                    handleNewFacultyFieldChange("designation", e.target.value)
                  }
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-blue-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-mono text-gray-400 mb-2">
                  Category *
                </label>
                <select
                  value={newFacultyData.category}
                  onChange={(e) =>
                    handleNewFacultyFieldChange("category", e.target.value)
                  }
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-blue-400 focus:outline-none"
                  required
                >
                  <option value="advisor">Advisor</option>
                  <option value="incharge">In Charge</option>
                  <option value="patron">Patron</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-mono text-gray-400 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={newFacultyData.image}
                  onChange={(e) =>
                    handleNewFacultyFieldChange("image", e.target.value)
                  }
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-blue-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddFaculty}
                className="flex items-center gap-2 bg-green-500/20 border border-green-500/40 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-colors font-mono"
              >
                <Plus className="w-4 h-4" />
                Add Faculty
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
      )}
    </div>
  );
}

export default function FacultyManagement() {
  return (
    <ProtectedRoute>
      <FacultyManagementContent />
    </ProtectedRoute>
  );
}
