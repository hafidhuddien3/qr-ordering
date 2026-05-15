const isMock = process.env.EXPO_PUBLIC_API_ISMOCK === "true";
// const isMock = true; // if you want to hardcode the mock mode, you can set it here. Otherwise, it will be determined by the environment variable EXPO_PUBLIC_API_ISMOCK.

import { apiService as apiServiceReal } from "./api";
import { apiService } from "./apiMock";

if (isMock) {
  console.log("Using mock API");
} else {
  console.log("Using real API");
}

export const api = isMock ? apiService : apiServiceReal;