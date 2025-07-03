"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import Image from "next/image";
import { storage } from "../firebase";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const galleryImages = [];

async function fetchImagesFromFirestore() {
  const images = [];

  try {
    const imagesFolderRef = ref(storage, "photoGalleryPics");

    const listResult = await listAll(imagesFolderRef);

    const imagePromises = listResult.items.map(async (item) => {
      const downloadURL = await getDownloadURL(item);
      return {
        id: item.name,
        src: downloadURL,
        alt: item.name,
      };
    });

    const images = await Promise.all(imagePromises);
    return images;
  } catch (error) {
    console.error("Error fetching images:", error);
  }

  return images;
}

const categories = ["All", "Projects", "Team", "Events"];

const ImageSkeleton = () => (
  <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg">
    <div className="w-full h-full flex items-center justify-center">
      <svg
        className="w-12 h-12 text-gray-300"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1zm-4.44-6.19l-2.35 3.02-1.56-1.88c-.2-.25-.58-.24-.78.01l-1.74 2.23c-.26.33-.02.81.39.81h8.98c.41 0 .65-.47.4-.8l-2.55-3.39c-.19-.26-.59-.26-.79 0z" />
      </svg>
    </div>
  </div>
);

export default function PhotoGallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentCategory, setCurrentCategory] = useState("All");
  const [filteredImages, setFilteredImages] = useState(galleryImages);
  const [direction, setDirection] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    setFilteredImages(
      currentCategory === "All"
        ? galleryImages
        : galleryImages.filter((img) => img.category === currentCategory)
    );
  }, [currentCategory]);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      const fetchedImages = await fetchImagesFromFirestore();
      setFilteredImages(fetchedImages);
    };

    fetchGalleryImages();
  }, []);

  const openLightbox = (image) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (newDirection) => {
    const currentIndex = filteredImages.findIndex(
      (img) => img.id === selectedImage.id
    );

    const newIndex =
      (currentIndex + newDirection + filteredImages.length) %
      filteredImages.length;
    setDirection(newDirection);
    setSelectedImage(filteredImages[newIndex]);
  };

  const handleImageLoad = (imageId) => {
    setLoadedImages((prev) => ({ ...prev, [imageId]: true }));
  };

  const variants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
  };

  return (
    <main className="bg-black">
      <Navbar />
      <div className="min-h-screen  p-8">
        <h1 className="text-[32px] font-bold text-white text-center mb-8">
          AMURoboclub Photo Gallery
        </h1>

        {/* Category Filter */}
        <div className="flex justify-center mb-8 space-x-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setCurrentCategory(category)}
              className={`px-4 py-2 rounded-full transition-colors ${
                currentCategory === category
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image) => (
            <motion.div
              key={image.id}
              layoutId={`image-${image.id}`}
              className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg aspect-w-3 aspect-h-2"
              onClick={() => openLightbox(image)}
              whileHover={{ scale: 1.05 }}
            >
              {!loadedImages[image.id] && <ImageSkeleton />}
              <Image
                src={image.src}
                alt={image.alt}
                width={300}
                height={200}
                className={`w-full h-64 object-cover transition-opacity duration-300 ${
                  loadedImages[image.id] ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => handleImageLoad(image.id)}
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <ZoomIn className="text-white w-10 h-10" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence initial={false} custom={direction}>
          {selectedImage && (
            <motion.div
              key="lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
              onClick={closeLightbox}
            >
              <motion.div
                key={selectedImage.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="relative w-full h-full max-w-4xl max-h-[90vh] mx-4 flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                {!loadedImages[selectedImage.id] && <ImageSkeleton />}
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  width={800}
                  height={600}
                  className={`w-full h-full object-contain transition-opacity duration-300 ${
                    loadedImages[selectedImage.id] ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => handleImageLoad(selectedImage.id)}
                />
                <button
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 text-white hover:text-gray-300"
                >
                  <X className="w-8 h-8" />
                </button>
                <button
                  onClick={() => navigateImage(-1)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                >
                  <ChevronLeft className="w-12 h-12" />
                </button>
                <button
                  onClick={() => navigateImage(1)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                >
                  <ChevronRight className="w-12 h-12" />
                </button>
                {/* <div className="absolute bottom-4 left-4 text-white text-lg font-semibold">
                  {selectedImage.alt}
                </div> */}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </main>
  );
}
