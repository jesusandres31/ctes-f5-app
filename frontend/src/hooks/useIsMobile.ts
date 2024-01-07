import { useEffect, useState } from "react";

export const useIsMobile = () => {
  const MOBILE_WIDTH = 800;
  const MOBILE_HEIGHT = 480;

  const [width, setWidth] = useState<number>(window.innerWidth);
  const [height, setHeight] = useState<number>(window.innerHeight);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile: boolean = width <= MOBILE_WIDTH || height <= MOBILE_HEIGHT;

  return { isMobile };
};
