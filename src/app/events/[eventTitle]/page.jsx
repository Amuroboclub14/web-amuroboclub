"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  Calendar,
  MapPin,
  ExternalLink,
  ArrowLeft,
  Loader2,
} from "lucide-react";

const EventDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const allEvents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Decode the URL parameter and find matching event
        // Replace underscores with spaces to match the event name
        const decodedTitle = params.eventTitle.replace(/_/g, " ");
        const foundEvent = allEvents.find((e) => e.eventName === decodedTitle);

        setEvent(foundEvent);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params.eventTitle]);

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-block px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider border";

    switch (status?.toLowerCase()) {
      case "past":
        return `${baseClasses} bg-green-500/10 text-green-400 border-green-400`;
      case "ongoing":
        return `${baseClasses} bg-cyan-500/10 text-cyan-400 border-cyan-400`;
      case "upcoming":
        return `${baseClasses} bg-orange-500/10 text-orange-400 border-orange-400`;
      default:
        return baseClasses;
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "TBD";
    return timeString;
  };

  const formatDetailsText = (text) => {
    if (!text) return "";
    return text
      .replace(/\*([^*]+)\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br/>");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <header className="sticky top-0 z-40 bg-black">
          <Navbar />
        </header>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-black text-white">
        <header className="sticky top-0 z-40 bg-black">
          <Navbar />
        </header>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <h1 className="text-3xl font-bold text-gray-400 mb-4">
            Event Not Found
          </h1>
          <button
            onClick={() => router.push("/events")}
            className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black rounded-full font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-40 bg-black">
        <Navbar />
      </header>

      <main className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => router.push("/events")}
            className="!font-mono flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-base">Back to Events</span>
          </button>

          {/* Two Column Layout: Poster Left, Details Right on Desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Event Poster (Hidden on mobile, shown on desktop) */}
            <div className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
              {event.posterURL ? (
                <img
                  src={event.posterURL}
                  alt={event.eventName}
                  className="w-full rounded-2xl object-cover"
                />
              ) : (
                <div className="w-full h-96 bg-gray-800 rounded-2xl flex items-center justify-center">
                  <span className="text-gray-400 text-2xl font-medium">
                    {event.eventName}
                  </span>
                </div>
              )}
            </div>

            {/* Right Column - Event Details */}
            <div className="space-y-6">
              {/* Event Title */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  {event.eventName}
                </h1>
                <div className="flex flex-wrap gap-2">
                  <span className={`text-sm ${getStatusBadge(event.status)}`}>
                    {event.status}
                  </span>
                  <span className="inline-block px-3 py-1.5 rounded-full text-sm font-medium bg-gray-800 text-gray-300 border border-gray-600">
                    {event.category}
                  </span>
                </div>
              </div>

              {/* Event Meta Info - Compact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date & Time Card */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                    <div className="!font-mono">
                      <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                        Date & Time
                      </div>
                      <div className="text-white text-base font-medium">
                        {event.date !== "" ? formatDate(event.date) : "TBD"}
                      </div>
                      {(event.startTime || event.endTime) && (
                        <div className="text-gray-300 text-sm mt-1">
                          {event.startTime && formatTime(event.startTime)}
                          {event.startTime && event.endTime && " - "}
                          {event.endTime && formatTime(event.endTime)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Location Card */}
                {event.place && (
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                      <div className="!font-mono">
                        <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                          Location
                        </div>
                        <div className="text-white text-base font-medium">
                          {event.place}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Registration Button */}
              {event.regFormLink && (
                <div>
                  <a
                    href={event.regFormLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="!font-mono w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-black px-6 py-4 rounded-xl text-base font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-400/50"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Registration / More Info
                  </a>
                </div>
              )}

              {/* About Event Section */}
              {event.details && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    About Event
                  </h2>
                  <div
                    className="!font-mono text-gray-300 text-base leading-relaxed prose prose-invert max-w-none
                    [&>p]:mb-4 [&>strong]:text-white [&>strong]:font-semibold
                    break-words overflow-wrap-anywhere [&_a]:break-all"
                    dangerouslySetInnerHTML={{
                      __html: formatDetailsText(event.details),
                    }}
                  />
                </div>
              )}

              {/* Event Poster - Mobile Only (Shown at the end on mobile) */}
              <div className="lg:hidden">
                {event.posterURL ? (
                  <img
                    src={event.posterURL}
                    alt={event.eventName}
                    className="w-full rounded-2xl object-cover"
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-800 rounded-2xl flex items-center justify-center">
                    <span className="text-gray-400 text-2xl font-medium">
                      {event.eventName}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventDetailPage;
