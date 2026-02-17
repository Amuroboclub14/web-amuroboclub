"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../ProtectedRoute";
import { getAllDocuments, updateDocument } from "../crudOperations";
import {
  ArrowLeft,
  FileText,
  ExternalLink,
  Search,
  Download,
  X,
  UserCheck,
} from "lucide-react";

const COLLECTION = "vercera_5_team_registrations";
const STATUSES = ["pending", "reviewed", "shortlisted", "rejected"];

const TEAM_LABELS = {
  outreach: "Outreach",
  management: "Management",
  video_editing: "Video Editing",
  sponsorship: "Sponsorship",
  graphic_design: "Graphic Design",
  hospitality: "Hospitality",
  decor: "Decor Team",
};

function formatDate(timestamp) {
  if (!timestamp) return "N/A";
  try {
    return new Date(timestamp).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "N/A";
  }
}

function ApplicationModal({ application, onClose, onStatusChange, onRefresh }) {
  if (!application) return null;
  const status = application.status ?? "pending";

  const handleStatusChange = async (newStatus) => {
    const result = await updateDocument(COLLECTION, application.id, {
      status: newStatus,
    });
    if (result.success) {
      onStatusChange(application.id, newStatus);
      onRefresh?.();
    }
  };

  const fields = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "contactNumber", label: "Contact (WhatsApp)" },
    {
      key: "teamPreference1",
      label: "Team Preference 1",
      format: (v) => TEAM_LABELS[v] || v,
    },
    {
      key: "teamPreference2",
      label: "Team Preference 2",
      format: (v) => TEAM_LABELS[v] || v,
    },
    { key: "whyApplying", label: "Why applying" },
    { key: "previousExperience", label: "Previous experience" },
    { key: "cvResumeLink", label: "CV / Resume link", link: true },
    { key: "departmentName", label: "Department" },
    { key: "facultyName", label: "Faculty name" },
    { key: "facultyNumber", label: "Faculty number" },
    { key: "enrollmentNumber", label: "Enrollment number" },
    { key: "yearOfStudy", label: "Year of study" },
    { key: "submittedTimestamp", label: "Submitted", format: formatDate },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700 shrink-0">
          <h2 className="text-xl font-bold font-mono text-white">
            {application.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-4">
          {/* Status selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-mono text-gray-400">Status:</span>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-violet-500 focus:outline-none"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {fields.map(({ key, label, format, link }) => {
            const value = application[key];
            if (value == null || value === "") return null;
            const display = format ? format(value) : String(value);
            return (
              <div key={key} className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-xs font-mono text-gray-400 mb-1">
                  {label}
                </div>
                <div className="text-sm text-white font-mono break-words">
                  {link && value ? (
                    <a
                      href={
                        value.startsWith("http") ? value : `https://${value}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-violet-400 hover:text-violet-300"
                    >
                      Open link <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    display
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ApplicationsContent() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDuplicatesOnly, setShowDuplicatesOnly] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const result = await getAllDocuments(COLLECTION);
      if (result.success) {
        setApplications(result.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const duplicateEmails = useMemo(() => {
    const byEmail = {};
    applications.forEach((a) => {
      const email = (a.email || "").trim().toLowerCase();
      if (email) byEmail[email] = (byEmail[email] || 0) + 1;
    });
    return new Set(
      Object.entries(byEmail)
        .filter(([, count]) => count > 1)
        .map(([email]) => email),
    );
  }, [applications]);

  const filteredApplications = useMemo(() => {
    let list = applications;
    if (showDuplicatesOnly && duplicateEmails.size > 0) {
      list = list.filter((a) =>
        duplicateEmails.has((a.email || "").trim().toLowerCase()),
      );
    }
    if (statusFilter !== "all") {
      list = list.filter((a) => (a.status ?? "pending") === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((a) => (a.name || "").toLowerCase().includes(q));
    }
    return list.sort(
      (a, b) => (b.submittedTimestamp ?? 0) - (a.submittedTimestamp ?? 0),
    );
  }, [applications, statusFilter, searchQuery, showDuplicatesOnly, duplicateEmails]);

  const handleStatusChange = (id, newStatus) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)),
    );
    if (selectedApplication?.id === id) {
      setSelectedApplication((prev) =>
        prev ? { ...prev, status: newStatus } : null,
      );
    }
  };

  const exportCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Contact",
      "Team Preference 1",
      "Team Preference 2",
      "Why Applying",
      "Previous Experience",
      "CV/Resume Link",
      "Department",
      "Faculty Name",
      "Faculty Number",
      "Enrollment Number",
      "Year of Study",
      "Status",
      "Submitted At",
    ];
    const rows = applications.map((a) => [
      a.name ?? "",
      a.email ?? "",
      a.contactNumber ?? "",
      TEAM_LABELS[a.teamPreference1] ?? a.teamPreference1 ?? "",
      TEAM_LABELS[a.teamPreference2] ?? a.teamPreference2 ?? "",
      (a.whyApplying ?? "").replace(/"/g, '""'),
      (a.previousExperience ?? "").replace(/"/g, '""'),
      a.cvResumeLink ?? "",
      a.departmentName ?? "",
      a.facultyName ?? "",
      a.facultyNumber ?? "",
      a.enrollmentNumber ?? "",
      a.yearOfStudy ?? "",
      a.status ?? "pending",
      formatDate(a.submittedTimestamp),
    ]);
    const csvContent =
      headers.join(",") +
      "\n" +
      rows
        .map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
        )
        .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vercera-5-team-applications-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-400 mx-auto mb-4" />
          <p className="text-gray-400 font-mono">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/admin")}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <UserCheck className="w-6 h-6 text-violet-400" />
                <div>
                  <h1 className="text-2xl font-bold font-mono">
                    Vercera 5.0 Team Applications
                  </h1>
                  <p className="text-gray-400 text-sm font-mono">
                    {applications.length} total
                    {showDuplicatesOnly
                      ? ` · ${filteredApplications.length} entries from ${duplicateEmails.size} duplicate submitter(s)`
                      : ` · ${filteredApplications.length} shown`}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={exportCSV}
              className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-4 py-2 rounded-lg hover:bg-emerald-500/30 transition-colors font-mono"
            >
              <Download className="w-5 h-5" />
              Export all to CSV
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-800">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm font-mono text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-gray-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-violet-500 focus:outline-none"
            >
              <option value="all">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <span className="text-sm font-mono text-gray-400">
              Duplicates only
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={showDuplicatesOnly}
              onClick={() => setShowDuplicatesOnly((v) => !v)}
              className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-black ${
                showDuplicatesOnly
                  ? "border-amber-500/50 bg-amber-500/30"
                  : "border-gray-600 bg-gray-800"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition translate-x-0.5 mt-0.5 ${
                  showDuplicatesOnly ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
            {duplicateEmails.size > 0 && (
              <span className="text-xs font-mono text-amber-400/90">
                ({duplicateEmails.size} person{duplicateEmails.size !== 1 ? "s" : ""})
              </span>
            )}
          </label>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-2 text-xs font-mono text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="text-left py-3 px-2 text-xs font-mono text-gray-400 uppercase tracking-wider hidden md:table-cell">
                Email
              </th>
              <th className="text-left py-3 px-2 text-xs font-mono text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                Contact
              </th>
              <th className="text-left py-3 px-2 text-xs font-mono text-gray-400 uppercase tracking-wider">
                Preference 1
              </th>
              <th className="text-left py-3 px-2 text-xs font-mono text-gray-400 uppercase tracking-wider hidden xl:table-cell">
                Preference 2
              </th>
              <th className="text-left py-3 px-2 text-xs font-mono text-gray-400 uppercase tracking-wider">
                CV / Resume
              </th>
              <th className="text-left py-3 px-2 text-xs font-mono text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app) => {
              const status = app.status ?? "pending";
              return (
                <tr
                  key={app.id}
                  className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors"
                >
                  <td className="py-3 px-2">
                    <button
                      onClick={() => setSelectedApplication(app)}
                      className="text-left font-mono text-violet-400 hover:text-violet-300 hover:underline"
                    >
                      {app.name || "—"}
                    </button>
                  </td>
                  <td className="py-3 px-2 text-sm font-mono text-gray-300 hidden md:table-cell">
                    {app.email || "—"}
                  </td>
                  <td className="py-3 px-2 text-sm font-mono text-gray-300 hidden lg:table-cell">
                    {app.contactNumber || "—"}
                  </td>
                  <td className="py-3 px-2 text-sm font-mono text-gray-300">
                    {TEAM_LABELS[app.teamPreference1] ||
                      app.teamPreference1 ||
                      "—"}
                  </td>
                  <td className="py-3 px-2 text-sm font-mono text-gray-300 hidden xl:table-cell">
                    {TEAM_LABELS[app.teamPreference2] ||
                      app.teamPreference2 ||
                      "—"}
                  </td>
                  <td className="py-3 px-2">
                    {app.cvResumeLink ? (
                      <a
                        href={
                          app.cvResumeLink.startsWith("http")
                            ? app.cvResumeLink
                            : `https://${app.cvResumeLink}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 bg-gray-700 hover:bg-gray-600 text-white text-xs font-mono px-2 py-1.5 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Open
                      </a>
                    ) : (
                      <span className="text-gray-500 text-sm">—</span>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    <select
                      value={status}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        const result = await updateDocument(
                          COLLECTION,
                          app.id,
                          {
                            status: newStatus,
                          },
                        );
                        if (result.success)
                          handleStatusChange(app.id, newStatus);
                      }}
                      className={`bg-gray-800 border rounded-lg px-2 py-1 text-xs font-mono focus:outline-none focus:ring-1 ${
                        status === "shortlisted"
                          ? "border-emerald-500/50 text-emerald-400"
                          : status === "rejected"
                            ? "border-red-500/50 text-red-400"
                            : status === "reviewed"
                              ? "border-amber-500/50 text-amber-400"
                              : "border-gray-600 text-gray-300"
                      }`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 font-mono">
              {applications.length === 0
                ? "No applications yet"
                : "No applications match your filters"}
            </p>
          </div>
        )}
      </div>

      {selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onStatusChange={handleStatusChange}
          onRefresh={fetchApplications}
        />
      )}
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <ProtectedRoute>
      <ApplicationsContent />
    </ProtectedRoute>
  );
}
