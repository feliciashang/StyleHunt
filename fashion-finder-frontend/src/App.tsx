import './App.css'
import axios from "axios";
import React, { useState } from 'react';
import "./index.css";
import GridDisplay from './GridDisplay';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [imageData, setImageData] = useState<[string, string][]>([]);
  const [similarUrl, setSimilarUrl] = useState<[string, string][]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadstart = () => {
      setIsLoading(true);
    };
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setIsLoading(false);
    }
    reader.readAsDataURL(selectedFile);
  }

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file)
    console.log("button clicked")
    try {
      const response = await axios.post("http://localhost:3000/api/vision", formData, {
      });
      console.log(response.data)
      if (Array.isArray(response.data.results)) {
        setImageData(
          response.data.results
            .map(
              (item: { imageUrl: string; pageUrl: string }) => [item.imageUrl, item.pageUrl] as [string, string])
        );
      }
      if (Array.isArray(response.data.similarResults)) {
        setSimilarUrl(
        response.data.similarResults
          .map(
            (item: { imageUrl: string; pageUrl: string }) => [item.imageUrl, item.pageUrl] as [string, string])
        );
      }   
    } catch (error) {
  console.error(error);
} finally {
  setIsLoading(false);
}
  }
return (
  <div className="min-h-screen flex flex-col justify-between px-4 py-8">
    <h1 className="text-6xl font-black text-center mb-8 tracking-tight">
      StyleHunt
    </h1>

    <div className="flex flex-col items-center justify-center w-full h-64 bg-neutral-secondary-medium rounded-base">
      <div className="flex flex-col items-center justify-center text-body pt-5 pb-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => document.getElementById('file-input')?.click()}
            className="inline-flex items-center text-white bg-brand hover:bg-brand-strong 
                        border border-transparent focus:ring-4 focus:ring-brand-medium 
                        shadow-xs font-medium rounded-base text-xs px-2 py-0.5"
          >
            <svg
              className="mr-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"  // Adjust the viewBox for a smaller icon
              width="16"  // Set width
              height="16"  // Set height
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth={2}
                d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
              />
            </svg>
            Upload a photo
          </button>
          {isLoading && (
            <div role="status">
              <div className="w-28 h-28 border-8 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="sr-only">Loading...</span>
            </div>
          )}
          {imagePreview && !isLoading && (
            <div style={{ height: '36px', width: '36px', border: '1px solid #d1d5db', borderRadius: '4px', padding: '2px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src={imagePreview} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
          )}
          <div style={{ width: '150px' }}></div>
          <button
            onClick={handleUpload}
            disabled={isLoading || !file}
            className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
          >
            Search
          </button>
        </div>
      </div>

      <input
        id="file-input"
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
    <div style={{ height: '50px' }}></div>
    {imageData.length > 0 || similarUrl.length > 0 && (
      <GridDisplay items={imageData} similarItems={similarUrl} />
    )}

  </div>

)
}

export default App

