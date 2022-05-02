import React from 'react'


export default function Loading() {
    return (
        <div className='fixed top-0 left-0 text-center py-52 w-full h-screen text-2xl font-bold text-gray-500 bg-black bg-opacity-40 z-[10000]'>
            <span className="animate-ping mx-10 inline-flex h-10 w-10 rounded-full bg-pink-400 opacity-75"></span>
            <span className="animate-ping mx-10 inline-flex h-10 w-10 rounded-full bg-pink-400 opacity-75"></span>
            <span className="animate-ping mx-10 inline-flex h-10 w-10 rounded-full bg-pink-400 opacity-75"></span>
            <span className="animate-ping mx-10 inline-flex h-10 w-10 rounded-full bg-pink-400 opacity-75"></span>
            <span className="animate-ping mx-10 inline-flex h-10 w-10 rounded-full bg-pink-400 opacity-75"></span>
        </div>
    )
}