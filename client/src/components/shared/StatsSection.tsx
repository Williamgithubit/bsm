'use client';
import React from 'react';
import Counter from '../ui/Counter';

const StatsSection = () => {
  const stats = [
    { number: 150, label: 'Athletes Scouted', suffix: '+' },
    { number: 10, label: 'Tournaments Hosted', suffix: '+' },
    { number: 5, label: 'Communities Impacted', suffix: '+' }
  ];

  return (
    <div className="bg-[#f8f9fa] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
              <div className="text-4xl font-bold text-[#03045e] mb-2">
                <Counter 
                  end={stat.number} 
                  suffix={stat.suffix}
                  duration={1500}
                />
              </div>
              <div className="text-gray-700">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;