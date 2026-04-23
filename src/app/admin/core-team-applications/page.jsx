"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../ProtectedRoute";
import { getAllDocuments, updateDocument } from "../crudOperations";
import { ArrowLeft, FileText, ExternalLink, Search, Download, X, UserCheck } from "lucide-react";

const COLLECTION = "core_team_recruitment_2026_27";
const STATUSES = ["pending", "reviewed", "shortlisted", "interview", "selected", "rejected"];

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
    const result = await updateDocument(COLLECTION, application.id, { status: newStatus });
    if (result.success) {
      onStatusChange(application.id, newStatus);
      onRefresh?.();
    }
  };

  const fields = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "facultyNumber", label: "Faculty Number" },
    { key: "enrollmentNumber", label: "Enrollment Number" },
    { key: "course", label: "Course" },
    { key: "courseOther", label: "Course (Other)" },
    { key: "branch", label: "Branch" },
    { key: "branchOther", label: "Branch (Other)" },
    { key: "yearOfStudy", label: "Year of Study (2026-27)" },
    { key: "mobileNumber", label: "Mobile Number" },
    { key: "postApplied", label: "Post Applied" },
    { key: "wasRegisteredMember", label: "Registered Member in 2025-26" },
    { key: "residencyStatus", label: "Hosteler / Day Scholar" },
    { key: "wasCoreTeamMember", label: "Core Team Member in 2025-26" },
    { key: "contributionStatement", label: "Contribution Statement" },
    { key: "involvedInOtherClub", label: "Involved in Other Club" },
    { key: "otherClubDetails", label: "Other Club Details" },
    { key: "priorExperience", label: "Prior Team/Organization Experience" },
    { key: "idProofShareableLink", label: "ID Proof Link", link: true },
    { key: "resumeShareableLink", label: "Resume/CV Link", link: true },
    { key: "submittedTimestamp", label: "Submitted", format: formatDate },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700 shrink-0">
          <h2 className="text-xl font-bold font-mono text-white">{application.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-mono text-gray-400">Status:</span>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-fuchsia-500 focus:outline-none"
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
                <div className="text-xs font-mono text-gray-400 mb-1">{label}</div>
                <div className="text-sm text-white font-mono break-words">
                  {link && value ? (
                    <a
                      href={value.startsWith("http") ? value : `https://${value}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-fuchsia-400 hover:text-fuchsia-300"
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

function CoreTeamApplicationsContent() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [postFilter, setPostFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const result = await getAllDocuments(COLLECTION);
      if (result.success) setApplications(result.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const postOptions = useMemo(() => {
    return Array.from(
      new Set(applications.map((a) => a.postApplied).filter(Boolean)),
    ).sort((a, b) => a.localeCompare(b));
  }, [applications]);

  const filteredApplications = useMemo(() => {
    let list = applications;
    if (statusFilter !== "all") {
      list = list.filter((a) => (a.status ?? "pending") === statusFilter);
    }
    if (postFilter !== "all") {
      list = list.filter((a) => a.postApplied === postFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (a) =>
          (a.name || "").toLowerCase().includes(q) ||
          (a.email || "").toLowerCase().includes(q),
      );
    }
    return list.sort((a, b) => (b.submittedTimestamp ?? 0) - (a.submittedTimestamp ?? 0));
  }, [applications, statusFilter, postFilter, searchQuery]);

  const handleStatusChange = (id, newStatus) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
    if (selectedApplication?.id === id) {
      setSelectedApplication((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const exportCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Faculty Number",
      "Enrollment Number",
      "Course",
      "Course Other",
      "Branch",
      "Branch Other",
      "Year Of Study",
      "Mobile Number",
      "Post Applied",
      "Registered Member (2025-26)",
      "Residency Status",
      "Core Team Member (2025-26)",
      "Contribution Statement",
      "Involved In Other Club",
      "Other Club Details",
      "Prior Experience",
      "ID Proof Link",
      "Resume Link",
      "Status",
      "Submitted At",
    ];
    const rows = applications.map((a) => [
      a.name ?? "",
      a.email ?? "",
      a.facultyNumber ?? "",
      a.enrollmentNumber ?? "",
      a.course ?? "",
      a.courseOther ?? "",
      a.branch ?? "",
      a.branchOther ?? "",
      a.yearOfStudy ?? "",
      a.mobileNumber ?? "",
      a.postApplied ?? "",
      a.wasRegisteredMember ?? "",
      a.residencyStatus ?? "",
      a.wasCoreTeamMember ?? "",
      (a.contributionStatement ?? "").replace(/"/g, '""'),
      a.involvedInOtherClub ?? "",
      (a.otherClubDetails ?? "").replace(/"/g, '""'),
      (a.priorExperience ?? "").replace(/"/g, '""'),
      a.idProofShareableLink ?? "",
      a.resumeShareableLink ?? "",
      a.status ?? "pending",
      formatDate(a.submittedTimestamp),
    ]);
    const csvContent =
      headers.join(",") +
      "\n" +
      rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `core-team-2026-27-applications-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-400 mx-auto mb-4" />
          <p className="text-gray-400 font-mono">Loading core-team applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 py-6">
            <div className="flex items-center gap-4">
              <button onClick={() => router.push("/admin")} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <UserCheck className="w-6 h-6 text-fuchsia-400" />
                <div>
                  <h1 className="text-2xl font-bold font-mono">Core Team 2026-27 Applications</h1>
                  <p className="text-gray-400 text-sm font-mono">
                    {applications.length} total · {filteredApplications.length} shown
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-800">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name/email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm font-mono text-white placeholder-gray-500 focus:border-fuchsia-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-gray-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-fuchsia-500 focus:outline-none"
            >
              <option value="all">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-gray-400">Post:</span>
            <select
              value={postFilter}
              onChange={(e) => setPostFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-fuchsia-500 focus:outline-none"
            >
              <option value="all">All posts</option>
              {postOptions.map((post) => (
                <option key={post} value={post}>
                  {post}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-2 text-xs font-mono text-gray-400 uppercase tracking-wider">Name</th>
              <th className="text-left py-3 px-2 text-xs font-mono text-gray-400 uppercase tracking-wider hidden md:table-cell">Email</th>
              <th className="text-left py-3 px-2 text-xs font-mono text-gray-400 uppercase tracking-wider hidden lg:table-cell">Mobile</th>
              <th className="text-left py-3 px-2 text-xs font-mono text-gray-400 uppercase tracking-wider">Post</th>
              <th className="text-left py-3 px-2 text-xs font-mono text-gray-400 uppercase tracking-wider hidden xl:table-cell">Year</th>
              <th className="text-left py-3 px-2 text-xs font-mono text-gray-400 uppercase tracking-wider">Docs</th>
              <th className="text-left py-3 px-2 text-xs font-mono text-gray-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app) => {
              const status = app.status ?? "pending";
              const hasLinks = (app.idProofShareableLink || "").trim() || (app.resumeShareableLink || "").trim();
              return (
                <tr key={app.id} className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors">
                  <td className="py-3 px-2">
                    <button
                      onClick={() => setSelectedApplication(app)}
                      className="text-left font-mono text-fuchsia-400 hover:text-fuchsia-300 hover:underline"
                    >
                      {app.name || "—"}
                    </button>
                  </td>
                  <td className="py-3 px-2 text-sm font-mono text-gray-300 hidden md:table-cell">{app.email || "—"}</td>
                  <td className="py-3 px-2 text-sm font-mono text-gray-300 hidden lg:table-cell">{app.mobileNumber || "—"}</td>
                  <td className="py-3 px-2 text-sm font-mono text-gray-300">{app.postApplied || "—"}</td>
                  <td className="py-3 px-2 text-sm font-mono text-gray-300 hidden xl:table-cell">{app.yearOfStudy || "—"}</td>
                  <td className="py-3 px-2">
                    {hasLinks ? (
                      <button
                        onClick={() => setSelectedApplication(app)}
                        className="inline-flex items-center gap-1 bg-gray-700 hover:bg-gray-600 text-white text-xs font-mono px-2 py-1.5 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View
                      </button>
                    ) : (
                      <span className="text-gray-500 text-sm">No</span>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    <select
                      value={status}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        const result = await updateDocument(COLLECTION, app.id, { status: newStatus });
                        if (result.success) handleStatusChange(app.id, newStatus);
                      }}
                      className={`bg-gray-800 border rounded-lg px-2 py-1 text-xs font-mono focus:outline-none focus:ring-1 ${
                        status === "selected"
                          ? "border-emerald-500/50 text-emerald-400"
                          : status === "shortlisted"
                            ? "border-cyan-500/50 text-cyan-400"
                            : status === "interview"
                              ? "border-blue-500/50 text-blue-400"
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
              {applications.length === 0 ? "No applications yet" : "No applications match your filters"}
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

export default function CoreTeamApplicationsPage() {
  return (
    <ProtectedRoute>
      <CoreTeamApplicationsContent />
    </ProtectedRoute>
  );
}
