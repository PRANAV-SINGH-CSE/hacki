import { useCallback, useState, type ImgHTMLAttributes } from "react";

type SmoothImageProps = ImgHTMLAttributes<HTMLImageElement>;

const SmoothImage = ({ className = "", onLoad, ...props }: SmoothImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const revealIfReady = useCallback((image: HTMLImageElement | null) => {
    if (image?.complete && image.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, []);

  return (
    <img
      {...props}
      ref={revealIfReady}
      className={`smooth-image${isLoaded ? " is-loaded" : ""} ${className}`}
      onLoad={(event) => {
        setIsLoaded(true);
        onLoad?.(event);
      }}
    />
  );
};

export default SmoothImage;
