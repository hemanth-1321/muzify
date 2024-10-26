"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function Appbar() {
  const { data: session } = useSession();
  return (
    <div className="flex justify-between p-4 bg-gray-100">
      <div className="text-lg font-bold">MuZify</div>
      <div>
        {session?.user ? (
          <button
            className="m-2 p-2 bg-blue-400 text-white rounded"
            onClick={() => signOut()}
          >
            Logout
          </button>
        ) : (
          <button
            className="m-2 p-2 bg-blue-400 text-white rounded"
            onClick={() => signIn()}
          >
            Sign in
          </button>
        )}
      </div>
    </div>
  );
}
