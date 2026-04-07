/**
 * Safely extracts a human-readable error message from various error response formats.
 * Prevents React child rendering errors by ensuring a string is always returned.
 */
export const getErrorMessage = (error: any): string => {
  if (!error) return "An unknown error occurred.";

  const data = error.response?.data;

  // 1. Check for 'error' field which might be an array of field errors or a string
  if (data?.error) {
    if (typeof data.error === "string") {
      return data.error;
    }
    
    if (Array.isArray(data.error)) {
      // Format: [{field: "title", message: "too short"}, ...]
      return data.error
        .map((err: any) => {
          if (typeof err === "string") return err;
          if (err.field && err.message) return `${err.field}: ${err.message}`;
          return JSON.stringify(err);
        })
        .join(", ");
    }
    
    if (typeof data.error === "object") {
       return data.error.message || JSON.stringify(data.error);
    }
  }

  // 2. Check for 'message' field
  if (data?.message && typeof data.message === "string") {
    return data.message;
  }

  // 3. Axios default error message
  if (error.message && typeof error.message === "string") {
    return error.message;
  }

  return "A system error occurred. Please try again.";
};
