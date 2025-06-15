"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import Image from "next/image";
import Navbar from "../components/Navbar";

const events = [
  {
    id: 1,
    title: "AMURoboclub Orientation",
    date: new Date(2023, 7, 14),
    status: "past",
    description:
      "Introduction of Projects: Discover the cutting-edge projects we're working on and a lot more!",
    location: "Main Auditorium",
    attendees: 150,
    image: "/orientation.JPG",
  },
  {
    id: 2,
    title: "PCB Design Workshop",
    date: new Date(2024, 9, 5),
    status: "past",
    description:
      "A 2-day workshop, where basics of designing and fabricating Printed Circuit Boards (PCBs) from scratch were covered.",
    location: "HPCL Lab. Electronics Department",
    attendees: 37,
    image: "/pcbDesignWorkshop.JPG",
  },
  {
    id: 3,
    title: "Solid Works Workshop",
    date: new Date(2024, 9, 19),
    status: "future",
    description: "Learn about Solid Works Software",
    location: "College Grounds",
    attendees: 100,
    image: "/SolidWorks-Logo.png",
  },
  {
    id: 4,
    title: "Upcoming Event",
    date: new Date(2024, 4, 10),
    status: "future",
    description: "event description",
    location: "Exhibition Hall",
    attendees: 200,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    title: "Upcoming Event",
    date: new Date(2024, 1, 15),
    status: "future",
    description: "event description",
    location: "Computer Lab",
    attendees: 75,
    image: "/placeholder.svg?height=200&width=300",
  },
];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const formatDate = (date) => {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getEventColor = (status) => {
  switch (status) {
    case "past":
      return "bg-gray-400";
    case "ongoing":
      return "bg-green-500";
    case "future":
      return "bg-blue-500";
    default:
      return "bg-gray-400";
  }
};

// Memoized Event Card Component
const EventCard = ({ event, onSelect }) => (
  <div
    className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 flex flex-col"
    onClick={() => onSelect(event)}
  >
    <Image
      src={event.image}
      alt={event.title}
      width={300}
      height={200}
      className="w-full h-48 object-cover"
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
    />
    <div className="p-4 flex-grow">
      <h3 className="font-bold text-lg mb-2">{event.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{formatDate(event.date)}</p>
      <p className="text-sm text-gray-600 whitespace-pre-wrap">
        {event.description}
      </p>
    </div>
    <div className="px-4 py-2 bg-gray-100 flex items-center">
      <div
        className={`w-3 h-3 rounded-full ${getEventColor(event.status)} mr-2`}
      ></div>
      <span className="text-sm capitalize">{event.status}</span>
    </div>
  </div>
);

export default function EventsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Memoize calendar days calculation
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  }, [currentDate]);

  // Memoize events by date mapping
  const eventsByDate = useMemo(() => {
    const map = new Map();
    events.forEach((event) => {
      const dateKey = `${event.date.getFullYear()}-${event.date.getMonth()}-${event.date.getDate()}`;
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey).push(event);
    });
    return map;
  }, []);

  const getEventsForDate = useCallback(
    (date) => {
      if (!date) return [];
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      return eventsByDate.get(dateKey) || [];
    },
    [eventsByDate]
  );

  const changeMonth = useCallback((increment) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + increment);
      return newDate;
    });
  }, []);

  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
  }, []);

  const closeEventDetails = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  return (
    <main className="md:bg-mainlight bg-white">
      <Navbar />
      <div className="min-h-screen bg-mainlight p-4 sm:p-8">
        <h1 className="text-4xl font-mont font-bold text-center mb-8 text-mainblue">
          AMURoboclub Events
        </h1>

        {/* Calendar Section */}
        <div className="bg-white rounded-lg shadow-md mb-8 p-4 sm:p-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <button
              className="p-2 rounded-md bg-gray-200 hover:bg-gray-300"
              onClick={() => changeMonth(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h2 className="text-xl sm:text-2xl font-bold font-mont">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              className="p-2 rounded-md bg-gray-200 hover:bg-gray-300"
              onClick={() => changeMonth(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center font-bold text-xs sm:text-sm"
              >
                {day}
              </div>
            ))}
            {calendarDays.map((date, index) => {
              const dayEvents = getEventsForDate(date);
              return (
                <div
                  key={index}
                  className="aspect-square p-1 sm:p-2 border rounded-lg bg-white relative overflow-hidden"
                >
                  {date && (
                    <>
                      <span className="absolute top-1 left-1 text-xs sm:text-sm">
                        {date.getDate()}
                      </span>
                      <div className="mt-4 sm:mt-6 space-y-1">
                        {dayEvents.map((event) => (
                          <div
                            key={event.id}
                            className={`${getEventColor(
                              event.status
                            )} text-white text-xs p-1 rounded cursor-pointer truncate`}
                            onClick={() => handleSelectEvent(event)}
                          >
                            {event.title}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto font-mono">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onSelect={handleSelectEvent}
            />
          ))}
        </div>

        {/* Event Details Modal */}
        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 font-mono"
              onClick={closeEventDetails}
            >
              <div
                className="bg-white rounded-lg w-full max-w-md overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <h2 className="text-2xl font-bold mb-2">
                    {selectedEvent.title}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {formatDate(selectedEvent.date)}
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-gray-500" />
                      <span className="capitalize">
                        {selectedEvent.status} Event
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                      <span>{selectedEvent.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-2 text-gray-500" />
                      <span>{selectedEvent.attendees} Attendees</span>
                    </div>
                    <p className="whitespace-pre-wrap">
                      {selectedEvent.description}
                    </p>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-100 text-right">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={closeEventDetails}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
