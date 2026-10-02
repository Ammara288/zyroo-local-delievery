// ============================================
// CENTRAL API SERVICE
// Reusable fetch wrapper for all API calls
// ============================================

import { buildUrl, METHODS, REQUEST_TIMEOUT } from "../api/config";

/**
 * Generic API request function
 * Handles: fetch, timeout, JSON parsing, errors
 */
export const apiRequest = async (endpoint, options = {}) => {
  const { method = METHODS.GET, body = null, headers = {} } = options;

  // Setup abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const config = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      signal: controller.signal,
    };

    // Add body for POST/PUT/PATCH
    if (body && method !== METHODS.GET) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(buildUrl(endpoint), config);
    clearTimeout(timeoutId);

    // Handle non-OK responses
    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // Response has no JSON body
      }
      throw new Error(errorMessage);
    }

    // Handle empty responses (204 No Content)
    if (response.status === 204) {
      return { success: true };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle timeout
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please check your connection and try again.");
    }

    // Handle network errors
    if (error.message === "Failed to fetch") {
      throw new Error("Cannot connect to server. Please make sure the API is running.");
    }

    // Re-throw other errors
    throw error;
  }
};

// ============================================
// SHORTHAND METHODS
// ============================================

export const apiGet = (endpoint) => apiRequest(endpoint, { method: METHODS.GET });

export const apiPost = (endpoint, body) =>
  apiRequest(endpoint, { method: METHODS.POST, body });

export const apiPut = (endpoint, body) =>
  apiRequest(endpoint, { method: METHODS.PUT, body });

export const apiPatch = (endpoint, body) =>
  apiRequest(endpoint, { method: METHODS.PATCH, body });

export const apiDelete = (endpoint) =>
  apiRequest(endpoint, { method: METHODS.DELETE });