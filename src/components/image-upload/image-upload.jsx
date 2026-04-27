import { ImagePlus, X } from "lucide-react";

export const ImageUploadTile = ({
  id,
  image,
  label,
  onSelect,
  onRemove,
  compact = false,
}) => (
  <div className={compact ? "w-24" : "w-full"}>
    <input
      id={id}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0];
        onSelect(file);
        e.target.value = "";
      }}
    />
    {image ? (
      <div
        className={`group relative overflow-hidden rounded-xl border border-gray-200 bg-white ${
          compact ? "h-24 w-24" : "h-72"
        }`}
      >
        <label htmlFor={id} className="block h-full cursor-pointer">
          <img
            src={image.preview}
            alt={label}
            className="h-full w-full object-cover"
          />
        </label>
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white"
        >
          <X size={12} />
        </button>
      </div>
    ) : (
      <label
        htmlFor={id}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-center text-gray-500 transition hover:border-gray-400 hover:bg-gray-100 ${
          compact ? "h-24 w-24 gap-1" : "h-72 gap-3"
        }`}
      >
        <ImagePlus className={compact ? "h-5 w-5" : "h-8 w-8"} />
        <span className={compact ? "text-[11px]" : "text-sm font-medium"}>
          {label}
        </span>
      </label>
    )}
  </div>
);
