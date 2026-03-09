"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

interface ErrorCode {
  code: number;
  name: string;
  description: string;
  possibleCauses: string[];
  resolution: string;
}

interface ApiEndpoint {
  endpoint: string;
  method: string;
  description: string;
  errorCodes: number[];
}

export default function ErrorsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Define all possible error codes and their meanings
  const errorCodes: ErrorCode[] = [
    {
      code: 400,
      name: "Bad Request",
      description: "The server cannot process the request due to client error.",
      possibleCauses: [
        "Invalid request parameters",
        "Malformed JSON in request body",
        "Missing required fields",
        "Invalid data format",
      ],
      resolution: "Check your request parameters and ensure all required fields are included with correct data types.",
    },
    {
      code: 401,
      name: "Unauthorized",
      description: "Authentication is required and has failed or not been provided.",
      possibleCauses: [
        "Missing authentication token",
        "Invalid or expired session",
        "Not logged in",
        "Missing credentials",
      ],
      resolution: "Log in to the application and ensure your session is valid. Check that credentials are being sent with the request.",
    },
    {
      code: 403,
      name: "Forbidden",
      description: "The server understood the request but refuses to authorize it.",
      possibleCauses: [
        "Insufficient permissions",
        "User doesn't have access to the requested resource",
        "Bot not installed on the server",
        "Token doesn't have required scopes",
      ],
      resolution: "Ensure you have the necessary permissions to access this resource. Install the bot if required.",
    },
    {
      code: 404,
      name: "Not Found",
      description: "The requested resource could not be found.",
      possibleCauses: [
        "Invalid guild/server ID",
        "Invalid channel ID",
        "Resource has been deleted",
        "Incorrect endpoint URL",
      ],
      resolution: "Verify that the resource ID is correct and that the resource exists.",
    },
    {
      code: 429,
      name: "Too Many Requests",
      description: "The user has sent too many requests in a given amount of time (rate limiting).",
      possibleCauses: [
        "Exceeded API rate limits",
        "Too many requests in short time period",
        "Discord API rate limiting",
      ],
      resolution: "Wait before making additional requests. Implement exponential backoff or respect the Retry-After header.",
    },
    {
      code: 500,
      name: "Internal Server Error",
      description: "The server encountered an unexpected condition that prevented it from fulfilling the request.",
      possibleCauses: [
        "Server-side bug or crash",
        "Database connection error",
        "Unhandled exception",
        "Third-party API failure",
      ],
      resolution: "This is a server-side error. Try again later or contact support if the issue persists.",
    },
    {
      code: 502,
      name: "Bad Gateway",
      description: "The server received an invalid response from an upstream server.",
      possibleCauses: [
        "Discord API is down or unreachable",
        "Gateway timeout to external service",
        "Proxy or load balancer error",
      ],
      resolution: "Wait a few moments and retry. Check the status of external services (Discord API).",
    },
    {
      code: 503,
      name: "Service Unavailable",
      description: "The server is temporarily unable to handle the request.",
      possibleCauses: [
        "Server is undergoing maintenance",
        "Server is overloaded",
        "Temporary service disruption",
      ],
      resolution: "Wait and retry after some time. Check service status page if available.",
    },
    {
      code: 504,
      name: "Gateway Timeout",
      description: "The server did not receive a timely response from an upstream server.",
      possibleCauses: [
        "External API took too long to respond",
        "Network connectivity issues",
        "Slow database query",
      ],
      resolution: "Retry the request. If the issue persists, contact support.",
    },
  ];

  // Define all API endpoints used in the application
  const apiEndpoints: ApiEndpoint[] = [
    {
      endpoint: "/me",
      method: "GET",
      description: "Get current authenticated user information",
      errorCodes: [401, 500, 502, 503],
    },
    {
      endpoint: "/me/guilds",
      method: "GET",
      description: "Fetch all Discord servers (guilds) the user is a member of",
      errorCodes: [401, 403, 429, 500, 502, 503],
    },
    {
      endpoint: "/me/guilds/:guildId",
      method: "GET",
      description: "Fetch all channels in a specific guild",
      errorCodes: [401, 403, 404, 429, 500, 502, 503],
    },
    {
      endpoint: "/api/guilds/:guildId/bot-installed",
      method: "GET",
      description: "Check if the bot is installed on a specific guild",
      errorCodes: [401, 403, 404, 500, 502, 503],
    },
    {
      endpoint: "/api/guilds/:guildId/bot-invite",
      method: "GET",
      description: "Get the bot invitation URL for a specific guild",
      errorCodes: [401, 403, 404, 500, 502, 503],
    },
    {
      endpoint: "/login",
      method: "GET",
      description: "Initiate Discord OAuth2 login flow",
      errorCodes: [400, 500, 502, 503],
    },
    {
      endpoint: "/logout",
      method: "POST",
      description: "Log out the current user and invalidate session",
      errorCodes: [401, 500],
    },
  ];

  // Common error types
  const errorTypes = [
    {
      type: "CORS Error",
      description: "Cross-Origin Resource Sharing (CORS) policy blocks the request",
      commonCauses: [
        "Backend CORS not configured properly",
        "Missing credentials: 'include' in fetch request",
        "Backend not accepting requests from frontend origin",
      ],
      howToFix: "Ensure backend has CORS enabled with proper credentials support. Add 'credentials: include' to fetch requests.",
    },
    {
      type: "Network Error",
      description: "Failed to establish a connection to the server",
      commonCauses: [
        "Server is not running",
        "Incorrect API URL",
        "Network connectivity issues",
        "Firewall blocking the request",
      ],
      howToFix: "Verify the server is running on the correct port. Check network connectivity and firewall settings.",
    },
    {
      type: "JSON Parse Error",
      description: "Failed to parse the response as JSON",
      commonCauses: [
        "Server returned non-JSON response",
        "Response body is empty",
        "Malformed JSON in response",
      ],
      howToFix: "Check server logs to see what is being returned. Ensure content-type header is set correctly.",
    },
    {
      type: "Discord API Error",
      description: "Error returned from Discord's API",
      commonCauses: [
        "Invalid Discord token",
        "Missing OAuth2 scopes",
        "Discord API rate limits",
        "Invalid Discord resource ID",
      ],
      howToFix: "Check Discord API documentation. Verify token and scopes. Implement rate limiting handling.",
    },
  ];

  const filteredErrors = selectedCategory === "all" 
    ? errorCodes 
    : errorCodes.filter(error => {
        if (selectedCategory === "client") return error.code >= 400 && error.code < 500;
        if (selectedCategory === "server") return error.code >= 500;
        return true;
      });

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4">API Error Reference</h1>
          <p className="text-gray-400 mb-8">
            Complete reference guide for all error codes and types in the PoroWeb API
          </p>

          {/* Error Categories Filter */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              All Errors
            </button>
            <button
              onClick={() => setSelectedCategory("client")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === "client"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              Client Errors (4xx)
            </button>
            <button
              onClick={() => setSelectedCategory("server")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === "server"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              Server Errors (5xx)
            </button>
          </div>

          {/* HTTP Status Codes Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">HTTP Status Codes</h2>
            <div className="grid gap-6">
              {filteredErrors.map((error) => (
                <div
                  key={error.code}
                  className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span
                      className={`text-2xl font-bold ${
                        error.code >= 500
                          ? "text-red-500"
                          : error.code >= 400
                          ? "text-yellow-500"
                          : "text-green-500"
                      }`}
                    >
                      {error.code}
                    </span>
                    <h3 className="text-xl font-semibold text-white">{error.name}</h3>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{error.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Possible Causes:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {error.possibleCauses.map((cause, idx) => (
                        <li key={idx} className="text-gray-400 text-sm">
                          {cause}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-gray-800 rounded p-4">
                    <h4 className="text-sm font-semibold text-green-400 mb-2">Resolution:</h4>
                    <p className="text-gray-300 text-sm">{error.resolution}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* API Endpoints Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">API Endpoints</h2>
            <div className="grid gap-4">
              {apiEndpoints.map((endpoint, idx) => (
                <div
                  key={idx}
                  className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded">
                      {endpoint.method}
                    </span>
                    <code className="text-green-400 font-mono text-sm">
                      {endpoint.endpoint}
                    </code>
                  </div>
                  
                  <p className="text-gray-400 mb-3 text-sm">{endpoint.description}</p>
                  
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 mb-2">Possible Error Codes:</h4>
                    <div className="flex flex-wrap gap-2">
                      {endpoint.errorCodes.map((code) => (
                        <span
                          key={code}
                          className={`px-2 py-1 rounded text-xs font-mono ${
                            code >= 500
                              ? "bg-red-900/30 text-red-400"
                              : "bg-yellow-900/30 text-yellow-400"
                          }`}
                        >
                          {code}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Common Error Types Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Common Error Types</h2>
            <div className="grid gap-6">
              {errorTypes.map((errorType, idx) => (
                <div
                  key={idx}
                  className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
                >
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {errorType.type}
                  </h3>
                  
                  <p className="text-gray-300 mb-4">{errorType.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Common Causes:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {errorType.commonCauses.map((cause, causeIdx) => (
                        <li key={causeIdx} className="text-gray-400 text-sm">
                          {cause}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-gray-800 rounded p-4">
                    <h4 className="text-sm font-semibold text-green-400 mb-2">How to Fix:</h4>
                    <p className="text-gray-300 text-sm">{errorType.howToFix}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Reference Table */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Reference Table</h2>
            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Quick Fix
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {errorCodes.map((error) => (
                    <tr key={error.code} className="hover:bg-gray-800/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`font-mono font-bold ${
                            error.code >= 500
                              ? "text-red-500"
                              : "text-yellow-500"
                          }`}
                        >
                          {error.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-white">
                        {error.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            error.code >= 500
                              ? "bg-red-900/30 text-red-400"
                              : "bg-yellow-900/30 text-yellow-400"
                          }`}
                        >
                          {error.code >= 500 ? "Server" : "Client"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {error.possibleCauses[0]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Best Practices Section */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Best Practices</h2>
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-800/30 rounded-lg p-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <div>
                    <span className="text-white font-medium">Always handle errors gracefully:</span>
                    <span className="text-gray-400"> Implement try-catch blocks around all API calls</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <div>
                    <span className="text-white font-medium">Implement retry logic:</span>
                    <span className="text-gray-400"> For 5xx errors and network failures, with exponential backoff</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <div>
                    <span className="text-white font-medium">Log errors comprehensively:</span>
                    <span className="text-gray-400"> Include request details, error messages, and stack traces</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <div>
                    <span className="text-white font-medium">Provide user-friendly messages:</span>
                    <span className="text-gray-400"> Don't expose technical error details to end users</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <div>
                    <span className="text-white font-medium">Monitor error rates:</span>
                    <span className="text-gray-400"> Set up alerts for unusual error patterns</span>
                  </div>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
