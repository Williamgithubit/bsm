"use client";
import React from "react";
import Image from "next/image";
import { Athlete } from "@/types/athlete";

interface Props {
  athlete: Athlete;
}

export default function AthleteCardPublic({ athlete }: Props) {
  return (
    <article className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative w-full h-56">
        <Image
          src={
            athlete.media && athlete.media.length > 0
              ? athlete.media[0].url
              : "/assets/1.jpg"
          }
          alt={athlete.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-medium text-[#E32845] bg-red-50 px-3 py-1 rounded-full">
            {athlete.level}
          </span>
          <div className="flex items-center text-xs text-gray-500">
            {athlete.county}
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{athlete.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {athlete.bio || "No bio available."}
        </p>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <div>{athlete.position || "—"}</div>
            <div>{athlete.age ? `${athlete.age} yrs` : "Age N/A"}</div>
          </div>
          <button
            onClick={() => (window.location.href = `/athletes/${athlete.id}`)}
            className="text-[#000054] font-medium hover:text-[#1e1e8f] transition-colors flex items-center"
          >
            View Profile
          </button>
        </div>
      </div>
    </article>
  );
}
