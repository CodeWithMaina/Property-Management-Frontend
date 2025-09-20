// src/hooks/useWindowSize.ts
import { useEffect, useState } from "react";

export const useWindowSize = () => {
  const [width, setWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return { width, isMobile: width < 768 };
};
