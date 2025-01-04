import React from 'react'
import Posts from './Posts'
import MiniProf from './MiniProf'


export default function Feed() {
  return (
    <main className='grid grid-cols-1 md:grid-cols-3 md:max-w-6xl mx-auto' >
      {/* post */}
      <section className='md:col-span-2' >
        <Posts />
      </section>

      {/* MiniProf */}
      <section className='hidden md:inline-grid md:col-span-1 ' >
        <MiniProf />
      </section>
    </main>
  );
}
