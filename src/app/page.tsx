"use client"
import { useEffect, useState } from "react";

export default function Home() {

  const [files, setFiles] = useState<{ createdAt: string, filename: string }[]>([]);
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    fetch(`/api/get-files-data?sortBy=${sortBy}`)
      .then((res) => res.json())
      .then((data) => setFiles(data));
  }, [sortBy]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex flex-col items-center justify-center">
        <select
          className="bg-gray-800 p-2 rounded"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date">Sort by created at</option>
          <option value="filename-asc">Sort by filename (asc)</option>
          <option value="filename-desc">Sort by filename (desc)</option>
        </select>

        <div className="grid grid-cols-2 gap-4 mt-6 w-1/2">
          {files.map((file, index) => (
            <div key={index} className="p-4 bg-gray-800 rounded-lg">
              <p>{file.createdAt}</p>
              <p className="font-bold">{file.filename}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
