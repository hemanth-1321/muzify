"use client";
import { useState } from "react";
import { Music } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

export function Appbar() {
  const session = useSession();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut();
    setLoading(false);
  };

  const handleSignIn = async () => {
    setLoading(true);
    await signIn();
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-900 shadow-lg">
      {/* Logo and title */}
      <div className="flex items-center space-x-3">
        <Music className="text-yellow-500" size={28} />
        <span className="text-2xl font-bold text-white hidden sm:block">
          MuZify
        </span>
      </div>

      {/* Sign in/out button */}
      <div>
        {session.data?.user ? (
          <button
            className="px-2 py-1 sm:px-4 sm:py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-md transition duration-300 flex items-center text-sm sm:text-base"
            onClick={handleSignOut}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border animate-spin mr-2 w-4 h-4 border-2 rounded-full border-t-white"></span>
            ) : (
              "Logout"
            )}
          </button>
        ) : (
          <button
            className="px-2 py-1 sm:px-4 sm:py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition duration-300 flex items-center text-sm sm:text-base"
            onClick={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border animate-spin mr-2 w-4 h-4 border-2 rounded-full border-t-white"></span>
            ) : (
              "Sign In"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
