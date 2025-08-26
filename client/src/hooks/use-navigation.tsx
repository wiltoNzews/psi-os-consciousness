import { useLocation } from "wouter";
import { useCallback } from "react";

/**
 * A custom hook for navigation that provides a similar API to react-router's useNavigate
 * but works with wouter.
 */
export function useNavigation() {
  const [location, setLocation] = useLocation();

  const navigate = useCallback((to: string) => {
    setLocation(to);
  }, [setLocation]);

  return [navigate, location] as const;
}