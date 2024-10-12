"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import Image from "next/image";

// Mock data for events
const events = [
  {
    id: 1,
    title: "Robo Wars 2023",
    date: new Date(2023, 10, 15),
    status: "past",
    description: "Annual robot fighting competition",
    location: "Main Auditorium",
    attendees: 150,
    // image: "/placeholder.svg?height=200&width=300",
    image: "/IMG_1559.JPG",
  },
  {
    id: 2,
    title: "AI Workshop",
    date: new Date(2024, 0, 20),
    status: "ongoing",
    description: "Learn about the latest in AI and robotics",
    location: "Lab 101",
    attendees: 50,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "Drone Racing League",
    date: new Date(2024, 2, 5),
    status: "future",
    description: "High-speed drone racing event",
    location: "College Grounds",
    attendees: 100,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    title: "Robotics Expo 2024",
    date: new Date(2024, 4, 10),
    status: "future",
    description: "Showcase of student robotics projects",
    location: "Exhibition Hall",
    attendees: 200,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    title: "Coding Challenge",
    date: new Date(2024, 1, 15),
    status: "future",
    description: "Test your coding skills in robotics",
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

export default function EventsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

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

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
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
  };

  const changeMonth = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    return events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        AMURoboclub Events
      </h1>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <Button variant="outline" onClick={() => changeMonth(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-bold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <Button variant="outline" onClick={() => changeMonth(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-bold">
                {day}
              </div>
            ))}
            {getDaysInMonth(currentDate).map((date, index) => {
              const dayEvents = getEventsForDate(date);
              return (
                <div
                  key={index}
                  className={`p-2 border rounded-lg ${
                    date ? "bg-white" : "bg-gray-100"
                  } min-h-[80px] relative`}
                >
                  {date && (
                    <>
                      <span className="absolute top-1 left-1 text-sm">
                        {date.getDate()}
                      </span>
                      <div className="mt-6 space-y-1">
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
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card
            key={event.id}
            className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
            onClick={() => handleSelectEvent(event)}
          >
            <Image
              src={event.image}
              alt={event.title}
              width={300}
              height={200}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
              <CardDescription>
                {event.date.toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{event.description}</p>
            </CardContent>
            <CardFooter>
              <div
                className={`w-3 h-3 rounded-full ${getEventColor(
                  event.status
                )} mr-2`}
              ></div>
              <span className="text-sm capitalize">{event.status}</span>
            </CardFooter>
          </Card>
        ))}
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closeEventDetails}
          >
            <Card
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedEvent.image}
                alt={selectedEvent.title}
                width={400}
                height={200}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <CardHeader>
                <CardTitle>{selectedEvent.title}</CardTitle>
                <CardDescription>
                  {selectedEvent.date.toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  <span>{selectedEvent.attendees} Expected Attendees</span>
                </div>
                <p>{selectedEvent.description}</p>
              </CardContent>
              <CardFooter>
                <Button onClick={closeEventDetails}>Close</Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
