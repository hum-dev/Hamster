"use client";
import { useSession, signIn, signOut } from 'next-auth/react';
import React from 'react'

export default function MiniProf() {
  const { data: session } = useSession();
  return (
      <div className="flex items-center justify-between mt-14 ml-10">
        <img
          src={session?.user?.image || "/assets/800px-Instagram_logo_2016.webp"}
          alt="user prof"
          className="w-16 h-16 rounded-full border p-[2px] "
        />

        <div className="flex-1 ml-4 " >
          <h2 className= " font-bold" >{session?.user?.username} </h2>
          <h3 className='text-sm text-gray-400'> Welcome To Humsta</h3>
        </div>

        {session ? (
        
        <button className="text-blue-500 text-sm font-semibold " onClick={signOut}>Sign Out</button>
        ) : (
         <button className="text-blue-500 text-sm font-semibold" onClick={signIn}>Sign In</button>)}

      </div>
  );
}
