import { Mail, Phone, Plus } from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    { id: "stationery", label: "Stationery" },
    { id: "personal", label: "Personal" },
    { id: "work", label: "Work" },
    { id: "team", label: "Team" },
    { id: "education", label: "Education" },
    { id: "family", label: "Family" },
    { id: "documents", label: "Documents" },
    { id: "work-week", label: "Work Week" },
    { id: "attendance", label: "Attendance" },
    { id: "leave", label: "Leave" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="flex h-16 items-center gap-4 px-4">
          <h1 className="text-xl font-semibold">Divya Singh</h1>
          <button className="rounded-md border border-gray-200 bg-white px-3 py-1 text-sm hover:bg-gray-50">
            Getting Started
          </button>
        </div>
        <div className="px-4">
          <nav className="flex gap-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`border-b-2 px-4 pb-4 pt-2 font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {activeTab === "personal" && (
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-[240px_1fr]">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="h-40 w-40 overflow-hidden rounded-full bg-gray-100">
                    <img
                      alt="Profile picture"
                      src="/placeholder.svg?height=160&width=160"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-white shadow-sm hover:bg-gray-50">
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Add profile picture</span>
                  </button>
                </div>
                <div className="text-center">
                  <h2 className="text-lg font-semibold">CEO</h2>
                  <p className="text-sm text-gray-500">
                    divyasinghde002@gmail.com
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold">Personal Info</h3>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">Divya Singh</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium">24/03/1993</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium">Female</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Blood Group</p>
                    <p className="font-medium">O+</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Marital Status</p>
                    <p className="font-medium">Single</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold">Contact Info</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Official Email ID</p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <p className="font-medium">divyasinghde002@gmail.com</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Personal Email ID</p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <p className="font-medium">divyasinghde002@gmail.com</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <p className="font-medium">8764398655</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">
                      Alternate Phone Number
                    </p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <p className="font-medium">-</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
