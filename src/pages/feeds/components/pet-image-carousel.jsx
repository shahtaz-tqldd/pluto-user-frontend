import React from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

const PetImageCarousel = ({ images = [], alt, className }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const imageList = images.filter(Boolean);
  const hasMultipleImages = imageList.length > 1;
  const safeActiveIndex = Math.min(activeIndex, imageList.length - 1);

  const showPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? imageList.length - 1 : current - 1,
    );
  };

  const showNext = () => {
    setActiveIndex((current) =>
      current === imageList.length - 1 ? 0 : current + 1,
    );
  };

  if (!imageList.length) {
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center bg-[#eef8f2] text-primary/55",
          className,
        )}
      >
        <ImageOff className="size-8" />
        <span className="mt-2 text-xs font-medium">No photo</span>
      </div>
    );
  }

  return (
    <div
      className={cn("group relative h-full w-full overflow-hidden", className)}
    >
      <img
        src={
          imageList[safeActiveIndex]["image_url"] || imageList[safeActiveIndex]
        }
        alt={alt}
        className="h-full w-full object-cover"
      />

      {hasMultipleImages ? (
        <>
          <button
            type="button"
            aria-label="Previous pet photo"
            onClick={showPrevious}
            className="absolute left-3 top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white opacity-90 backdrop-blur transition hover:bg-black/65 sm:opacity-0 sm:group-hover:opacity-100"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Next pet photo"
            onClick={showNext}
            className="absolute right-3 top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white opacity-90 backdrop-blur transition hover:bg-black/65 sm:opacity-0 sm:group-hover:opacity-100"
          >
            <ChevronRight className="size-5" />
          </button>

          <div className="absolute right-4 top-14 z-20 rounded-full bg-black/45 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
            {safeActiveIndex + 1}/{imageList.length}
          </div>

          <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center gap-1.5">
            {imageList.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                aria-label={`Show pet photo ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "size-1.5 rounded-full bg-white/55 transition",
                  safeActiveIndex === index && "w-4 bg-white",
                )}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default PetImageCarousel;
