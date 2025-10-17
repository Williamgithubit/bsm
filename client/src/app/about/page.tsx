'use client';
import React from "react";
import Image from "next/image";
import Card from "@/components/ui/Card";
const teamImage = "/assets/2.jpg";
import {
  FaBullseye,
  FaHandsHelping,
  FaLightbulb,
  FaGlobeAfrica,
  FaFutbol,
  FaTrophy,
  FaUsers,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { MdDateRange, MdLocationOn, MdEmail } from "react-icons/md";
import { motion } from "framer-motion";

// Image paths from public directory
const ceoImage = "/assets/14.jpg";
const coachImage = "/assets/coach-emmanuel-doe.jpg";
const managerImage = "/assets/manager-sarah-kollie.jpg";

const About = () => {
  const values = [
    {
      icon: <FaBullseye className="mx-auto text-4xl text-[#03045e] mb-4" />,
      title: "Excellence",
      description:
        "We strive for the highest standards in athlete development and management.",
    },
    {
      icon: <FaHandsHelping className="mx-auto text-4xl text-[#03045e] mb-4" />,
      title: "Community",
      description: "We foster strong connections with athletes and local communities.",
    },
    {
      icon: <FaLightbulb className="mx-auto text-4xl text-[#03045e] mb-4" />,
      title: "Innovation",
      description: "We embrace creative approaches to football training and scouting.",
    },
    {
      icon: <FaGlobeAfrica className="mx-auto text-4xl text-[#03045e] mb-4" />,
      title: "Accessibility",
      description: "We ensure opportunities reach aspiring athletes across Liberia.",
    },
  ];

  const impactStats = [
    {
      number: "150+",
      label: "Athletes Scouted",
      description: "Discovered through our grassroots programs",
      icon: <FaFutbol className="text-5xl text-[#E32845] mb-4 mx-auto" />,
    },
    {
      number: "10+",
      label: "Events Hosted",
      description: "Tournaments and training camps organized",
      icon: <FaTrophy className="text-5xl text-[#E32845] mb-4 mx-auto" />,
    },
    {
      number: "5+",
      label: "Communities Impacted",
      description: "Through equipment donations and outreach",
      icon: <FaUsers className="text-5xl text-[#E32845] mb-4 mx-auto" />,
    },
  ];

  const teamMembers = [
    {
      id: 1,
      name: "Hallie Johnson",
      role: "Founder & CEO (Regista Benzardinho)",
      bio: "Visionary leader with a passion for football and youth empowerment, driving BSM's mission to build champions in Liberia.",
      image: ceoImage,
      social: {
        linkedin: "https://www.linkedin.com/in/hallie-johnson-bsm/",
        instagram: "https://www.instagram.com/registabenzardinho/",
        twitter: "https://twitter.com/BSM_Liberia",
      },
    },
    {
      id: 2,
      name: "Henry Barchue",
      role: "Head Coach",
      bio: "FIFA-licensed coach with over 10 years of experience, dedicated to training young athletes for professional success.",
      image: coachImage,
      social: {
        linkedin: "#",
        instagram: "#",
      },
    },
    {
      id: 3,
      name: "Sarah Kollie",
      role: "Community Outreach Manager",
      bio: "Passionate about uplifting communities through football, leading equipment donations and local engagement initiatives.",
      image: managerImage,
      social: {
        linkedin: "#",
        twitter: "#",
      },
    },
  ];

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      {/* About Benzard Sports Management */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h1 className="text-4xl font-bold text-[#03045e] mb-6">
              About Benzard Sports Management
            </h1>
            <div className="text-lg text-gray-700 mb-6">
              <p className="mb-6">
                Founded in 2020 by Hallie Johnson (Regista Benzardinho), Benzard Sports Management (BSM) is dedicated to empowering Liberian youth through football. We collaborate with FIFA and CAF to scout, train, and manage aspiring athletes, helping them rise from grassroots to glory.
              </p>
            </div>
            <p className="text-lg text-gray-700 mb-8">
              Our mission is to build champions by providing world-class training, organizing tournaments, and supporting communities through outreach programs like equipment donations.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:border-[#E32845] transition-colors duration-300">
                <div className="flex items-center justify-center text-[#E32845] mb-2">
                  <MdDateRange className="text-3xl mr-2" />
                  <span className="text-3xl font-bold text-[#03045e]">
                    2020
                  </span>
                </div>
                <div className="text-gray-600 text-center">Founded</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:border-[#E32845] transition-colors duration-300">
                <div className="flex items-center justify-center text-[#E32845] mb-2">
                  <MdLocationOn className="text-3xl mr-2" />
                  <span className="text-3xl font-bold text-[#03045e]">5</span>
                </div>
                <div className="text-gray-600 text-center">Locations</div>
              </div>
            </div>
          </div>
          <div className="relative w-full h-96 md:h-[500px] rounded-lg overflow-hidden">
            <Image
              src={teamImage}
              alt="BSM athletes training on the field"
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>

        {/* Founder/CEO Section */}
        <div className="mt-24 mb-16">
          <div className="bg-gradient-to-r from-[#03045e] to-[#1a1a6e] rounded-2xl p-10 text-white overflow-hidden relative">
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">
                  Message From Our Founder
                </h2>
                <div className="w-20 h-1 bg-[#E32845] mx-auto mb-6"></div>
                <p className="text-blue-100 max-w-3xl mx-auto">
                  Leading the charge in transforming football in Liberia
                </p>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-1/3 flex justify-center">
                  <div className="relative">
                    <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-white/20">
                      <Image
                        src={ceoImage}
                        alt="Hallie Johnson, Founder & CEO"
                        className="object-cover"
                        fill
                        sizes="(max-width: 768px) 256px, 256px"
                      />
                    </div>
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-[#03045e] px-4 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
                      Founder & CEO
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-2/3">
                  <h3 className="text-2xl font-bold mb-4">
                    Hallie Johnson (Regista Benzardinho)
                  </h3>
                  <p className="text-blue-100 mb-6 leading-relaxed">
                    &quot;At Benzard Sports Management, our vision is to empower every young Liberian footballer to reach their full potential, regardless of their background. We are building a future where talent meets opportunity on the pitch.&quot;
                  </p>
                  <p className="text-blue-100 mb-8 leading-relaxed">
                    With a deep passion for football and community development, I founded BSM to create pathways for young athletes to shine, supported by world-class coaching and community initiatives.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <motion.a
                      href="https://www.linkedin.com/in/hallie-johnson-bsm/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors duration-200"
                      whileHover={{ y: -2 }}
                    >
                      <FaLinkedin className="text-xl" />
                      <span>LinkedIn</span>
                    </motion.a>
                    <motion.a
                      href="https://www.instagram.com/registabenzardinho/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors duration-200"
                      whileHover={{ y: -2 }}
                    >
                      <FaInstagram className="text-xl" />
                      <span>Instagram</span>
                    </motion.a>
                    <motion.a
                      href="https://twitter.com/BSM_Liberia"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors duration-200"
                      whileHover={{ y: -2 }}
                    >
                      <FaTwitter className="text-xl" />
                      <span>Twitter</span>
                    </motion.a>
                    <motion.a
                      href="mailto:contact@benzardsportsmanagement.com"
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors duration-200"
                      whileHover={{ y: -2 }}
                    >
                      <MdEmail className="text-xl" />
                      <span>Email</span>
                    </motion.a>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#E32845] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-[#03045e] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          </div>
        </div>

        {/* Impact Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#03045e] mb-8 text-center">
            Our Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {impactStats.map((stat, index) => (
              <div
                key={index}
                className="text-center bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                {stat.icon}
                <div className="text-4xl font-bold text-[#03045e] mb-2">
                  {stat.number}
                </div>
                <div className="text-xl font-semibold text-gray-900 mb-2">
                  {stat.label}
                </div>
                <p className="text-gray-600">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#03045e] mb-4">
                Our Team
              </h2>
              <div className="w-20 h-1 bg-[#E32845] mx-auto mb-6"></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Meet our dedicated team of coaches and managers passionate about football and youth empowerment
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <motion.div
                  key={member.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src={member.image}
                      alt={member.name}
                      className="object-cover"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6 w-full">
                      <h3 className="text-xl font-bold text-white">
                        {member.name}
                      </h3>
                      <p className="text-blue-100">{member.role}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-6">{member.bio}</p>
                    <div className="flex space-x-4">
                      {member.social.linkedin && (
                        <a
                          href={member.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0077b5] hover:text-[#005582] transition-colors"
                          aria-label={`${member.name}'s LinkedIn`}
                        >
                          <FaLinkedin className="text-xl" />
                        </a>
                      )}
                      {member.social.instagram && (
                        <a
                          href={member.social.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#E1306C] hover:text-[#C13584] transition-colors"
                          aria-label={`${member.name}'s Instagram`}
                        >
                          <FaInstagram className="text-xl" />
                        </a>
                      )}
                      {member.social.twitter && (
                        <a
                          href={member.social.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1DA1F2] hover:text-[#1991da] transition-colors"
                          aria-label={`${member.name}'s Twitter`}
                        >
                          <FaTwitter className="text-xl" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-6">
                Interested in joining our mission?
              </p>
              <a
                href="/contact"
                className="inline-block bg-[#03045e] hover:bg-[#1a1a6e] text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
              >
                Get Involved
              </a>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div>
          <h2 className="text-3xl font-bold text-[#03045e] mb-8 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index}>
                <div className="flex flex-col h-full p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex justify-center">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-[#03045e] mb-3 text-center">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-center flex-1">
                    {value.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;