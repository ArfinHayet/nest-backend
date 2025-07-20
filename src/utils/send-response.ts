// utils/response.ts
export function sendResponse(payload: any, message : string, status : number) {
  return {
    message,
    statusCode : status,
    payload,
  };
}
