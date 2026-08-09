"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import ReCAPTCHAComponent from "../../components/ReCAPTCHA";
import Link from "next/link";
import { ExternalLink, Volume2, VolumeX, Pause, Play } from "lucide-react";

const courseOptions = ["B.Tech", "B.E", "M.Tech", "Other"];

const branchOptions = [
  "Computer Engineering",
  "Electronics Engineering",
  "Artificial Intelligence",
  "Chemical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Petrochemical Engineering",
  "Food Technology",
  "Other",
];

const yearOptions = ["First Year", "Second Year", "Third Year", "Fourth Year"];

/** Set to `false` when applications should close. */
const IS_TECHNOXIAN_RECRUITMENT_PORTAL_OPEN = true;

const LAST_YEAR_INSTAGRAM_PERMALINK =
  "https://www.instagram.com/reel/DPjmkg5AVtC/";

/**
 * Optional clean player: put an mp4 in /public (e.g. public/videos/technoxian.mp4)
 * and set this to "/videos/technoxian.mp4". Native video has no Instagram chrome.
 * Leave empty to use a cropped Instagram embed (video-only framing).
 */
const LAST_YEAR_VIDEO_SRC = "/videos/technoxian.mp4";

const RESOURCES = [
  {
    title: "Technoxian Official Website",
    description: "About the championship, categories, and updates.",
    href: "https://www.technoxian.com/",
  },
  {
    title: "Our Past Technoxian Projects",
    description: "Explore AMURoboclub projects from previous Technoxian seasons.",
    href: "/projects",
  },
];

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Pretty autoplay (muted) player with seek bar + unmute control. */
function TechnoxianHighlightVideo() {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const isScrubbingRef = useRef(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !LAST_YEAR_VIDEO_SRC) return;

    video.muted = true;
    const playPromise = video.play();
    if (playPromise?.catch) {
      playPromise.catch(() => setIsPlaying(false));
    }

    const onTimeUpdate = () => {
      if (isScrubbingRef.current) return;
      setCurrentTime(video.currentTime);
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };
    const onLoaded = () => setDuration(video.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("durationchange", onLoaded);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("durationchange", onLoaded);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && video.paused) {
      video.play().catch(() => {});
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const seekToClientX = (clientX) => {
    const video = videoRef.current;
    const bar = progressRef.current;
    if (!video || !bar || !video.duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    video.currentTime = ratio * video.duration;
    setProgress(ratio * 100);
    setCurrentTime(video.currentTime);
  };

  const onProgressPointerDown = (e) => {
    isScrubbingRef.current = true;
    seekToClientX(e.clientX);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onProgressPointerMove = (e) => {
    if (!isScrubbingRef.current) return;
    seekToClientX(e.clientX);
  };

  const onProgressPointerUp = (e) => {
    isScrubbingRef.current = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  if (LAST_YEAR_VIDEO_SRC) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <div className="group relative overflow-hidden rounded-2xl border border-orange-500/25 bg-black shadow-[0_0_50px_-18px_rgba(251,146,60,0.45)] ring-1 ring-white/5">
          <video
            ref={videoRef}
            src={LAST_YEAR_VIDEO_SRC}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="relative z-0 w-full h-auto max-h-[70vh] object-contain bg-black"
            onClick={togglePlay}
          >
            Your browser does not support the video tag.
          </video>

          {/* Bottom controls */}
          <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-3 pb-3 pt-10 sm:px-4 sm:pb-4">
            <div
              ref={progressRef}
              role="slider"
              aria-label="Seek"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
              tabIndex={0}
              onPointerDown={onProgressPointerDown}
              onPointerMove={onProgressPointerMove}
              onPointerUp={onProgressPointerUp}
              onPointerCancel={onProgressPointerUp}
              onKeyDown={(e) => {
                const video = videoRef.current;
                if (!video?.duration) return;
                if (e.key === "ArrowRight") {
                  video.currentTime = Math.min(
                    video.duration,
                    video.currentTime + 5,
                  );
                } else if (e.key === "ArrowLeft") {
                  video.currentTime = Math.max(0, video.currentTime - 5);
                }
              }}
              className="group/bar relative mb-3 h-1.5 cursor-pointer rounded-full bg-white/20 touch-none"
            >
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-orange-400 to-amber-300 transition-[width] duration-75"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-white shadow-md ring-2 ring-orange-400/80 opacity-90 group-hover/bar:opacity-100"
                style={{ left: `calc(${progress}% - 7px)` }}
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause" : "Play"}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-orange-500/90"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 fill-current" />
                  ) : (
                    <Play className="h-4 w-4 fill-current ml-0.5" />
                  )}
                </button>
                <span className="font-mono text-[11px] sm:text-xs text-white/80 tabular-nums">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute video" : "Mute video"}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/55 px-3 py-1.5 text-xs sm:text-sm font-medium text-white backdrop-blur-md transition-all hover:bg-orange-500/90 hover:border-orange-400/50"
              >
                {isMuted ? (
                  <>
                    <VolumeX className="h-4 w-4" />
                    <span>Unmute</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4" />
                    <span>Mute</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const embedSrc = `${LAST_YEAR_INSTAGRAM_PERMALINK.replace(/\/?$/, "/")}embed`;

  return (
    <div className="mx-auto w-full max-w-[360px]">
      <div className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-black border border-gray-700/80 shadow-xl">
        <iframe
          src={embedSrc}
          title="AMURoboclub at Technoxian"
          className="absolute left-1/2 w-[115%] max-w-none -translate-x-1/2 border-0"
          style={{
            top: "-12%",
            height: "135%",
          }}
          loading="lazy"
          allow="clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
      <a
        href={LAST_YEAR_INSTAGRAM_PERMALINK}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center justify-center gap-1.5 w-full text-xs text-gray-500 hover:text-orange-400 transition-colors"
      >
        Open full reel on Instagram <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}

function formatSubmitFailureMessage(error) {
  const code = typeof error?.code === "string" ? error.code : "";
  const message = typeof error?.message === "string" ? error.message : "";

  let detail =
    "Something went wrong while submitting. Please try again in a moment.";
  if (code === "permission-denied") {
    detail =
      "The server rejected this submission (access rules). If you are an applicant, contact the team with the error code below—this is usually a configuration issue on our side.";
  } else if (code === "unavailable" || code === "deadline-exceeded") {
    detail =
      "We could not reach the database (network hiccup or service busy). Check your internet connection and try again.";
  } else if (code === "resource-exhausted") {
    detail =
      "The service is temporarily overloaded. Wait a short time and try again.";
  } else if (
    message &&
    /network|fetch|Failed to fetch|load failed/i.test(message)
  ) {
    detail =
      "A network error occurred. Try switching Wi‑Fi/mobile data, disable VPN, or try again when the connection is stable.";
  }

  const ref =
    code || (message ? message.split("\n")[0].slice(0, 120) : "unknown");
  return `${detail} If it keeps happening, share this code with the team: ${ref}`;
}

function TechnoxianPortalClosed() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto px-4 py-16 md:py-24"
        >
          <div className="text-center space-y-6 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-gray-700/50 p-8 md:p-10 rounded-2xl shadow-2xl">
            <p className="text-sm font-mono uppercase tracking-widest text-orange-400">
              Applications closed
            </p>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
              Technoxian 11.0 Project Recruitment
            </h1>
            <p className="text-gray-300 font-mono text-base leading-relaxed">
              The application portal is now closed. Thank you to everyone who
              applied—your submissions are being reviewed.
            </p>
            <Link
              href="/projects"
              className="inline-block mt-2 text-orange-400 hover:text-orange-300 text-sm font-mono"
            >
              ← Back to Projects
            </Link>
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-sm text-gray-400">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      {children}
    </div>
  );
}

function TechnoxianRecruitmentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [submitError, setSubmitError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    facultyNumber: "",
    enrollmentNumber: "",
    branch: "",
    branchOther: "",
    yearOfStudy: "",
    course: "",
    courseOther: "",
    contribution: "",
  });

  const updateField = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const isRequiredFilled = () => {
    const required = [
      "name",
      "email",
      "phone",
      "facultyNumber",
      "enrollmentNumber",
      "branch",
      "yearOfStudy",
      "course",
      "contribution",
    ];
    for (const key of required) {
      if (!formData[key]?.trim()) return false;
    }
    if (formData.course === "Other" && !formData.courseOther.trim())
      return false;
    if (formData.branch === "Other" && !formData.branchOther.trim())
      return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!isRequiredFilled()) {
      setSubmitError("Please fill all required fields before submitting.");
      return;
    }

    if (!recaptchaToken) {
      setSubmitError("Please complete the reCAPTCHA verification.");
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "technoxian_11_project_recruitment"), {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        facultyNumber: formData.facultyNumber.trim(),
        enrollmentNumber: formData.enrollmentNumber.trim(),
        branch: formData.branch,
        branchOther:
          formData.branch === "Other" ? formData.branchOther.trim() : null,
        yearOfStudy: formData.yearOfStudy,
        course: formData.course,
        courseOther:
          formData.course === "Other" ? formData.courseOther.trim() : null,
        contribution: formData.contribution.trim(),
        status: "pending",
        recaptchaToken,
        submittedTimestamp: Date.now(),
      });

      alert(
        "Application submitted successfully for Technoxian 11.0 Project Recruitment.",
      );
      setFormData({
        name: "",
        email: "",
        phone: "",
        facultyNumber: "",
        enrollmentNumber: "",
        branch: "",
        branchOther: "",
        yearOfStudy: "",
        course: "",
        courseOther: "",
        contribution: "",
      });
      setRecaptchaToken(null);
    } catch (error) {
      console.error("Error submitting Technoxian form:", error);
      setSubmitError(formatSubmitFailureMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "h-10 w-full px-3 rounded-md bg-gray-900/80 border border-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500/70 focus:border-orange-500/70 transition-colors";

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto px-4 py-10 md:py-12"
        >
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
              Technoxian 11.0 Project Recruitment
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              Apply to join AMURoboclub projects for Technoxian 11.0.
            </p>
            <Link
              href="/projects"
              className="inline-block mt-3 text-orange-400 hover:text-orange-300 text-sm"
            >
              ← Back to Projects
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mb-8"
          >
            <div className="relative overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 via-gray-900 to-amber-500/10 p-4 md:p-5 shadow-[0_0_40px_-12px_rgba(251,146,60,0.35)]">
              <div className="text-center mb-4">
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-orange-400/90">
                  Catch our vibe
                </p>
                <h2 className="text-lg md:text-xl font-semibold text-white mt-1">
                  Last year at Technoxian
                </h2>
                <p className="text-gray-400 text-sm mt-1 max-w-xl mx-auto">
                  A glimpse of AMURoboclub on the Technoxian stage — then apply
                  below.
                </p>
              </div>
              <div className="mx-auto w-full">
                <TechnoxianHighlightVideo />
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
            <form
              onSubmit={handleSubmit}
              className="space-y-6 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-gray-700/50 p-5 md:p-6 rounded-xl"
            >
              <div className="space-y-4">
                <div className="border-l-2 border-orange-400 pl-3">
                  <h2 className="text-sm font-semibold tracking-wide text-orange-400 uppercase">
                    Basic Information
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Name" required>
                    <input
                      value={formData.name}
                      onChange={updateField("name")}
                      type="text"
                      placeholder="Your full name"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Email" required>
                    <input
                      value={formData.email}
                      onChange={updateField("email")}
                      type="email"
                      placeholder="your@email.com"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Phone" required>
                    <input
                      value={formData.phone}
                      onChange={updateField("phone")}
                      type="tel"
                      placeholder="Mobile number"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Faculty Number" required>
                    <input
                      value={formData.facultyNumber}
                      onChange={updateField("facultyNumber")}
                      type="text"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Enrollment Number" required>
                    <input
                      value={formData.enrollmentNumber}
                      onChange={updateField("enrollmentNumber")}
                      type="text"
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-l-2 border-amber-400 pl-3">
                  <h2 className="text-sm font-semibold tracking-wide text-amber-400 uppercase">
                    Academic Details
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Course" required>
                    <select
                      value={formData.course}
                      onChange={updateField("course")}
                      className={inputClass}
                    >
                      <option value="">Select Course</option>
                      {courseOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Branch of Study" required>
                    <select
                      value={formData.branch}
                      onChange={updateField("branch")}
                      className={inputClass}
                    >
                      <option value="">Select Branch</option>
                      {branchOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </Field>
                  {formData.course === "Other" && (
                    <Field label="Specify Course" required>
                      <input
                        value={formData.courseOther}
                        onChange={updateField("courseOther")}
                        type="text"
                        className={inputClass}
                      />
                    </Field>
                  )}
                  {formData.branch === "Other" && (
                    <Field label="Specify Branch" required>
                      <input
                        value={formData.branchOther}
                        onChange={updateField("branchOther")}
                        type="text"
                        className={inputClass}
                      />
                    </Field>
                  )}
                  <Field label="Year of Study" required>
                    <select
                      value={formData.yearOfStudy}
                      onChange={updateField("yearOfStudy")}
                      className={inputClass}
                    >
                      <option value="">Select Year</option>
                      {yearOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-l-2 border-yellow-400 pl-3">
                  <h2 className="text-sm font-semibold tracking-wide text-yellow-400 uppercase">
                    Contribution
                  </h2>
                </div>
                <Field
                  label="How can you contribute to the team/projects? (one liner)"
                  required
                >
                  <input
                    value={formData.contribution}
                    onChange={updateField("contribution")}
                    type="text"
                    placeholder="e.g. Embedded systems and PCB design"
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="space-y-3">
                <div className="border-l-2 border-amber-400 pl-3">
                  <h3 className="text-sm font-semibold tracking-wide text-amber-400 uppercase">
                    Security Verification
                  </h3>
                </div>
                <div className="bg-gray-900/60 border border-gray-700/50 rounded-lg p-3">
                  <ReCAPTCHAComponent
                    onVerify={setRecaptchaToken}
                    onError={() => setRecaptchaToken(null)}
                  />
                </div>
              </div>

              <div className="space-y-3 pt-1">
                {submitError && (
                  <div className="p-3 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
                    {submitError}
                  </div>
                )}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-lg text-sm font-bold text-black bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 transition-all duration-300 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </div>
            </form>

            <aside className="lg:sticky lg:top-6">
              <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50 rounded-xl p-5">
                <h2 className="text-sm font-semibold tracking-wide text-orange-400 uppercase mb-3">
                  Resources
                </h2>
                <ul className="space-y-3">
                  {RESOURCES.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block rounded-lg border border-gray-700/60 bg-gray-900/50 px-3 py-2.5 hover:border-orange-500/40 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm text-white font-medium group-hover:text-orange-300">
                            {item.title}
                          </span>
                          <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-orange-400 shrink-0 mt-0.5" />
                        </div>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}

export default function Technoxian11RecruitmentPage() {
  if (!IS_TECHNOXIAN_RECRUITMENT_PORTAL_OPEN) {
    return <TechnoxianPortalClosed />;
  }
  return <TechnoxianRecruitmentForm />;
}
