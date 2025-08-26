import { useContext } from "react";

interface ToastContextType {
  toast: (message: string, type?: "success" | "error" | "info") => void;
}

// Mock toast context - in a real app, this would be a more complete implementation
export function useToast(): ToastContextType {
  return {
    toast: (message: string, type = "info") => {
      console.log(`Toast (${type}): ${message}`);
      // In a real implementation, this would show a toast notification in the UI
    }
  };
}