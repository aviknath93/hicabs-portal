export interface CustomError extends Error {
  status?: number; // HTTP status code
  message: string; // General error message
  errors?: Array<ErrorDetail>; // Array of detailed error information
  [key: string]: any; // Index signature for additional properties
}

interface ErrorDetail {
  field: string; // The field related to the error
  constraints: Record<string, string>; // Constraints with their corresponding messages
}
