"use client";

import { useState } from "react";

function CodeExamples() {
  const [activeTab, setActiveTab] = useState<"ts" | "curl">("ts");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const tsCode = `// Select a file from an input element
const file = input.files[0];
const formData = new FormData();
formData.append("video", file);

// Send to FastAPI /predict
const response = await fetch("${apiUrl}/predict", {
  method: "POST",
  headers: {
    Authorization: "Bearer " + apiKey,
  },
  body: formData,
});

if (!response.ok) {
  const error = await response.json();
  throw new Error(error?.error || "Failed to analyze video");
}

const analysis = await response.json();
console.log("Analysis:", analysis);`;

const curlCode = `# Replace <API_KEY> with your key and video.mp4 with your file
curl -X POST \\
  -H "Authorization: Bearer <API_KEY>" \\
  -F "video=@video.mp4" \\
  ${apiUrl}/predict`;


  return (
    <div className="bg-opacity-70 mt-3 flex h-fit w-full flex-col rounded-xl bg-gray-100 p-4">
      <span className="text-sm">API Usage</span>
      <span className="mb-4 text-sm text-gray-500">
        Examples of how to use the API with TypeScript and cURL.
      </span>

      <div className="overflow-hidden rounded-md bg-gray-900">
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab("ts")}
            className={`px-4 py-2 text-xs ${
              activeTab === "ts"
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            TypeScript
          </button>
          <button
            onClick={() => setActiveTab("curl")}
            className={`px-4 py-2 text-xs ${
              activeTab === "curl"
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            cURL
          </button>
        </div>
        <div className="p-4">
          <pre className="max-h-[300px] overflow-y-auto text-xs text-gray-300">
            <code>{activeTab === "ts" ? tsCode : curlCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

export default CodeExamples;
