const STATUS_MESSAGES = {
  400: "The request could not be processed. Check the form and try again.",
  401: "Your session has expired. Please sign in again.",
  403: "You do not have permission to perform this action.",
  404: "The requested resource was not found.",
  409: "This action conflicts with existing records.",
  422: "Some fields are invalid. Please review and try again.",
  500: "The server encountered an error. Please try again later.",
  501: "This capability is not available yet.",
};

export function getErrorMessage(error) {
  if (!error) return "Something went wrong. Please try again.";

  if (!error.response) {
    if (error.code === "ERR_NETWORK" || error.message?.includes("Network")) {
      return "Unable to reach the StockFlow API. Confirm the backend is running on port 3001.";
    }
    return error.message || "Something went wrong. Please try again.";
  }

  const status = error.response.status;
  const serverMessage = error.response.data?.message;
  if (serverMessage && typeof serverMessage === "string" && !serverMessage.startsWith("Axios")) {
    return serverMessage;
  }
  return STATUS_MESSAGES[status] || "Something went wrong. Please try again.";
}

export function isNotImplemented(error) {
  const status = error?.response?.status;
  const code = error?.response?.data?.code;
  return status === 501 || code === "NOT_IMPLEMENTED" || code === "AI_NOT_IMPLEMENTED";
}
