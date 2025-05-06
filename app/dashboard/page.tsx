"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="container max-w-md mx-auto py-10 text-center">
      <h1 className="text-3xl font-bold mb-6">Welcome to HerSafety Dashboard</h1>
      <div className="space-y-4">
        <button
          className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded"
          onClick={() => router.push("/report-incident")}
        >
          Report Incident
        </button>
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded"
          onClick={() => router.push("/track-case")}
        >
          Track Case
        </button>
      </div>
    </div>
  );
} 