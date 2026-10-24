import { cn } from "../lib/cn.ts";
import type { StudioImage } from "../content/images.ts";

export function FrameImage({
  image,
  className,
  priority = false,
  fill = false,
  sizes = "(min-width: 1024px) 40vw, 100vw",
}: {
  image: StudioImage;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
}) {
  return (
    <img
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={cn(
        "object-contain object-center",
        fill ? "h-full w-full" : "h-auto w-full",
        className,
      )}
    />
  );
}
