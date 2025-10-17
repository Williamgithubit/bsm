'use client';
import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#03045e] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold text-[#E32845] mb-4">Benzard Sports Management</h2>
            <p className="text-gray-300 mb-6">
              Building champions from grassroots to glory through football scouting, training, and community outreach in Liberia.
            </p>
            <div className="flex space-x-6 mt-4">
              <a href="https://www.facebook.com/benzardsports" className="text-gray-300 hover:text-[#E32845] transition-colors duration-200 text-2xl" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="https://twitter.com/BSM_Liberia" className="text-gray-300 hover:text-[#E32845] transition-colors duration-200 text-2xl" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://www.instagram.com/registabenzardinho/" className="text-gray-300 hover:text-[#E32845] transition-colors duration-200 text-2xl" aria-label="Instagram">
                <FaInstagram />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-[#E32845] transition-colors duration-200">Home</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-[#E32845] transition-colors duration-200">About Us</Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-[#E32845] transition-colors duration-200">Services</Link></li>
              <li><Link href="/events" className="text-gray-300 hover:text-[#E32845] transition-colors duration-200">Events</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li><Link href="/athletes" className="text-gray-300 hover:text-[#E32845] transition-colors duration-200">Athlete Directory</Link></li>
              <li><Link href="/blog" className="text-gray-300 hover:text-[#E32845] transition-colors duration-200">News</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-[#E32845] transition-colors duration-200">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-2 text-[#E32845] flex-shrink-0" />
                <span className="text-gray-300">Paynesville City, Montserrado County, Liberia</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-2 text-[#E32845]" />
                <a href="tel:+231777123456" className="text-gray-300 hover:text-[#E32845] transition-colors duration-200">+231 777 123 456</a>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-2 text-[#E32845]" />
                <a href="mailto:info@benzardsportsmanagement.com" className="text-gray-300 hover:text-[#E32845] transition-colors duration-200">info@benzardsportsmanagement.com</a>
              </li>
              <li className="flex items-center">
                <FaClock className="mr-2 text-[#E32845]" />
                <span className="text-gray-300">Mon - Fri: 8:00 AM - 4:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#E32845] mt-8 pt-8 text-center">
          <p className="text-gray-400">
            {currentYear} Benzard Sports Management. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;