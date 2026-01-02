"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { X, Clock, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import Footer from "../components/Footer";

const AMURoboclubEvents = () => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFilter, setActiveFilter] = useState("upcoming");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "events"));

        const allEvents = querySnapshot.docs.map((doc) => ({
          id: doc.id, // document ID if needed
          ...doc.data(), // spreads all fields like eventName, date, etc.
        }));

        setEvents(allEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchAllEvents();
  }, []);

  const categoryStats = events.reduce((acc, e) => {
    const key = e.category || "Uncategorized";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const categories = Object.entries(categoryStats).map(
    ([category, count], idx) => ({ id: idx, category, count })
  );

  const filteredEvents = events.filter((event) => {
    // Category filtering logic
    let categoryMatch = false;
    if (activeCategory === "all") {
      categoryMatch = true;
    } else {
      categoryMatch = event.category === activeCategory;
    }

    // Status filtering logic
    let statusMatch = false;
    if (activeFilter === "all") {
      statusMatch = true;
    } else {
      statusMatch = event.status.toLowerCase() === activeFilter;
    }

    return categoryMatch && statusMatch;
  });

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setIsDropdownOpen(false);
  };
  const getActiveCategoryData = () => {
    if (activeCategory === "all")
      return {
        category: "All Categories",
        count: categories.reduce((sum, cat) => sum + cat.count, 0),
      };
    return (
      categories.find((cat) => cat.category === activeCategory) || {
        category: "All Categories",
        count: 0,
      }
    );
  };

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-block px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider border";

    switch (status.toLowerCase()) {
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

  const truncateText = (text, maxLength = 120) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black">
        <Navbar />
      </header>

      {/* Main Content */}
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-10">
            <h1 className="text-[32px] md:text-[40px] font-bold mb-5 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
              Discover Events
            </h1>
            <p className="!font-mono text-[18px] text-gray-400 max-w-3xl mx-auto !leading-relaxed">
              Explore our robotics workshops, competitions, and community
              activities designed to foster innovation and hands-on learning.
            </p>
          </div>

          {/* Categories Section */}
          {categories.length >= 1 && (
            <section className="mb-10">
              <div className="flex flex-col gap-5 sm:flex-row items-center justify-between mb-10">
                <h2 className="font-mono text-white text-opacity-40 mx-auto md:mx-0 text-xl font-semibold">
                  Browse by Category
                </h2>
                {activeCategory !== "all" && (
                  <button
                    onClick={() => setActiveCategory("all")}
                    className="px-4 text-sm font-mono py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-cyan-400 text-white rounded-full font-medium transition-all duration-300 flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Remove Filter
                  </button>
                )}
              </div>

              {/* Mobile Dropdown (visible on small screens) */}
              <div className="block sm:hidden mb-6">
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full font-mono bg-gray-900 border border-gray-800 rounded-2xl px-6 py-4 text-left cursor-pointer transition-all duration-300 hover:border-cyan-400 relative overflow-hidden group flex items-center justify-between"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                    <div className="relative z-10">
                      <div
                        className={`text-lg font-semibold mb-1 ${
                          activeCategory !== "all"
                            ? "text-cyan-400"
                            : "text-white"
                        }`}
                      >
                        {getActiveCategoryData().category}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {getActiveCategoryData().count} Events
                      </div>
                    </div>
                    <div className="relative z-10">
                      {isDropdownOpen ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden z-50 shadow-2xl">
                      <div
                        onClick={() => handleCategorySelect("all")}
                        className={`font-mono px-6 py-4 cursor-pointer transition-all duration-300 hover:bg-gray-800 hover:border-l-4 hover:border-l-cyan-400 border-l-4 border-l-transparent ${
                          activeCategory === "all"
                            ? "bg-cyan-400/5 border-l-cyan-400"
                            : ""
                        }`}
                      >
                        <div
                          className={`text-lg font-semibold mb-1 ${
                            activeCategory === "all"
                              ? "text-cyan-400"
                              : "text-white"
                          }`}
                        >
                          All Categories
                        </div>
                        <div className="text-gray-400 text-sm">
                          {categories.reduce((sum, cat) => sum + cat.count, 0)}{" "}
                          Events
                        </div>
                      </div>

                      {categories.map((category) => (
                        <div
                          key={category.id}
                          onClick={() =>
                            handleCategorySelect(category.category)
                          }
                          className={`font-mono px-6 py-4 cursor-pointer transition-all duration-300 hover:bg-gray-800 hover:border-l-4 hover:border-l-cyan-400 border-l-4 border-l-transparent ${
                            activeCategory === category.category
                              ? "bg-cyan-400/5 border-l-cyan-400"
                              : ""
                          }`}
                        >
                          <div
                            className={`text-lg font-semibold mb-1 ${
                              activeCategory === category.category
                                ? "text-cyan-400"
                                : "text-white"
                            }`}
                          >
                            {category.category}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {category.count} Events
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Desktop Grid (hidden on small screens) */}
              <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => setActiveCategory(category.category)}
                    className={`
                     font-mono bg-gray-900 border rounded-2xl px-6 py-4 sm:px-8 sm:py-6 text-center cursor-pointer transition-all duration-300 hover:border-cyan-400 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-400/10 relative overflow-hidden group
                     ${
                       activeCategory === category.category
                         ? "border-cyan-400 bg-cyan-400/5"
                         : "border-gray-800"
                     }
                   `}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                    <div
                      className={`text-lg sm:text-xl font-semibold mb-2 relative z-10 ${
                        activeCategory === category.category
                          ? "text-cyan-400"
                          : "text-white"
                      }`}
                    >
                      {category.category}
                    </div>
                    <div className="text-gray-400 text-sm relative z-10">
                      {category.count} Events
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Event Filters */}
          <div className="!font-mono flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 mb-12">
            {[
              { id: "all", label: "All Events" },
              { id: "ongoing", label: "Ongoing" },
              { id: "upcoming", label: "Upcoming" },
              { id: "past", label: "Past Events" },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`
                  px-5 sm:px-6 py-3 rounded-full !text-lg font-medium border transition-all duration-300
                  ${
                    activeFilter === filter.id
                      ? "bg-cyan-400 border-cyan-400 text-black"
                      : "bg-gray-900 border-gray-700 text-white hover:border-cyan-400 hover:text-cyan-400"
                  }
                `}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-400 text-lg mb-4">No events found</div>
              <p className="text-gray-500 text-[16px] !font-mono">
                Try adjusting your filters to see more events
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {filteredEvents.map((event, index) => (
                <div
                  key={event.id}
                  onClick={() =>
                    router.push(`/events/${event.eventName.replace(/ /g, "_")}`)
                  }
                  className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden transition-all duration-500 hover:border-cyan-400 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-400/15 group cursor-pointer"
                  style={{
                    animation: `fadeInUp 0.6s ease forwards`,
                    animationDelay: `${index * 0.1}s`,
                    opacity: 0,
                  }}
                >
                  {/* Event Image */}
                  <div className="relative">
                    {event.posterURL ? (
                      <img
                        src={event.posterURL}
                        alt={event.eventName}
                        className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-56 bg-gray-800 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                        <span className="text-cyan-400 !text-base font-medium">
                          {event.eventName}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 !font-mono">
                      <span
                        className={`!text-lg  ${getStatusBadge(event.status)}`}
                      >
                        {event.status}
                      </span>
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className=" flex flex-col justify-between p-4 sm:p-6 ">
                    <div className="text-cyan-400 !text-sm font-medium mb-3 flex items-center gap-4">
                      <span className="!text-lg  !font-mono">
                        {event.date != "" ? formatDate(event.date) : "TBD"}
                      </span>
                      {event.startTime && (
                        <span className="flex !text-lg  !font-mono items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(event.startTime)}
                        </span>
                      )}
                    </div>

                    <h3 className="!text-[14px] sm:!text-xl leading-[1.5rem] font-semibold text-white mb-3">
                      {event.eventName}
                    </h3>

                    {event.details && (
                      <p className=" !font-mono text-gray-400 !text-sm sm:!text-lg !leading-relaxed mb-4">
                        {truncateText(
                          event.details
                            .replace(/\*([^*]+)\*/g, "$1")
                            .replace(/\n/g, " ")
                        )}
                      </p>
                    )}

                    <div className="flex items-center justify-between  !font-mono">
                      <span className="!text-sm text-gray-500 bg-gray-800 px-2 py-1 rounded">
                        {event.category}
                      </span>
                      {event.place && (
                        <span className="!text-sm text-gray-400  !font-mono flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.place}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AMURoboclubEvents;
