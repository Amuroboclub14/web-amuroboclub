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
  Calendar,
} from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function EventsManagement() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editData, setEditData] = useState({});
  const [newField, setNewField] = useState({ key: "", value: "" });
  const [expandedEvents, setExpandedEvents] = useState(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEventData, setNewEventData] = useState({
    eventName: "",
    date: "",
    startTime: "",
    endTime: "",
    place: "",
    details: "",
    posterURL: "",
    regFormLink: "",
    category: "",
    status: "upcoming",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const result = await getAllDocuments("events");
      if (result.success) {
        setEvents(result.data);
      } else {
        console.error("Error fetching events:", result.error);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event.id);
    setEditData({ ...event });
    setNewField({ key: "", value: "" });
  };

  const handleSave = async () => {
    try {
      const { id, createdAt, updatedAt, ...dataToUpdate } = editData;
      const result = await updateDocument("events", editingEvent, dataToUpdate);

      if (result.success) {
        // Refresh the events list from Firebase to get the latest data
        await fetchEvents();
        setEditingEvent(null);
        setEditData({});
      } else {
        console.error("Error updating event:", result.error);
        alert("Failed to update event: " + result.error);
      }
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Error updating event: " + error.message);
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
          "events",
          editingEvent,
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
        "events",
        editingEvent,
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

  const toggleExpand = (eventId) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  const handleDeleteEvent = async (eventId, eventName) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${eventName}"? This action cannot be undone.`
      )
    ) {
      try {
        const result = await deleteDocument("events", eventId);

        if (result.success) {
          await fetchEvents(); // Refresh the events list
          alert("Event deleted successfully");
        } else {
          console.error("Error deleting event:", result.error);
          alert("Failed to delete event: " + result.error);
        }
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Error deleting event: " + error.message);
      }
    }
  };

  const handleAddEvent = async () => {
    try {
      const result = await createDocument("events", newEventData);

      if (result.success) {
        await fetchEvents(); // Refresh the events list
        setShowAddForm(false);
        setNewEventData({
          eventName: "",
          date: "",
          startTime: "",
          endTime: "",
          place: "",
          details: "",
          posterURL: "",
          regFormLink: "",
          category: "",
          status: "upcoming",
        });
        alert("Event added successfully!");
      } else {
        console.error("Error adding event:", result.error);
        alert("Failed to add event: " + result.error);
      }
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Error adding event: " + error.message);
    }
  };

  const handleNewEventFieldChange = (key, value) => {
    setNewEventData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="font-mono text-gray-400">Loading events...</p>
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
                <Calendar className="w-6 h-6 text-blue-400" />
                <h1 className="text-2xl font-bold font-mono">
                  Events Management
                </h1>
              </div>
            </div>

            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-green-500/20 border border-green-500/40 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-colors font-mono"
            >
              <Plus className="w-5 h-5" />
              Add Event
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-gray-400 font-mono">
            Total Events: {events.length}
          </p>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden"
            >
              {/* Compact Card Header */}
              <div className="p-4 border-b border-gray-800">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold font-mono text-white mb-1">
                      {event.eventName || event.name || "Unnamed Event"}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400 font-mono">
                      <span>ID: {event.id}</span>
                      {event.date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {event.date}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(event)}
                      className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/40 text-blue-400 px-3 py-1 rounded-lg hover:bg-blue-500/30 transition-colors font-mono text-sm"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteEvent(
                          event.id,
                          event.eventName || event.name || "Unnamed Event"
                        )
                      }
                      className="flex items-center gap-2 bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-1 rounded-lg hover:bg-red-500/30 transition-colors font-mono text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>

                    <button
                      onClick={() => toggleExpand(event.id)}
                      className="flex items-center gap-2 bg-gray-500/20 border border-gray-500/40 text-gray-400 px-3 py-1 rounded-lg hover:bg-gray-500/30 transition-colors font-mono text-sm"
                    >
                      {expandedEvents.has(event.id) ? (
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
              {(expandedEvents.has(event.id) || editingEvent === event.id) && (
                <div className="p-6">
                  {editingEvent === event.id ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold font-mono text-blue-400">
                          Editing Event
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
                            onClick={() => setEditingEvent(null)}
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
                                rows={typeof value === "object" ? 4 : 2}
                              />
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
                      {Object.entries(event).map(([key, value]) => {
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

        {events.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 font-mono">No events found</p>
          </div>
        )}
      </div>

      {/* Add Event Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold font-mono text-green-400">
                Add New Event
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
                {Object.entries(newEventData).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <label className="text-sm font-mono text-gray-300 capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </label>
                    {key === "details" ? (
                      <textarea
                        value={value}
                        onChange={(e) =>
                          handleNewEventFieldChange(key, e.target.value)
                        }
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-green-400 focus:outline-none resize-none"
                        rows={4}
                      />
                    ) : key === "status" ? (
                      <select
                        value={value}
                        onChange={(e) =>
                          handleNewEventFieldChange(key, e.target.value)
                        }
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-green-400 focus:outline-none"
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="past">Past</option>
                      </select>
                    ) : (
                      <input
                        type={
                          key.includes("date")
                            ? "date"
                            : key.includes("time")
                            ? "time"
                            : "text"
                        }
                        value={value}
                        onChange={(e) =>
                          handleNewEventFieldChange(key, e.target.value)
                        }
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-green-400 focus:outline-none"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleAddEvent}
                  className="flex items-center gap-2 bg-green-500/20 border border-green-500/40 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-colors font-mono"
                >
                  <Plus className="w-4 h-4" />
                  Add Event
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
