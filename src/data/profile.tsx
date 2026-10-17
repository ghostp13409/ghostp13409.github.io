import { FaGithub, FaLinkedinIn, FaInstagram } from "react-icons/fa6";
import { SiLeetcode } from "react-icons/si";
import type { Social, InProgressLearning, Hobby } from "../types/portfolio";
import React from "react";

export const socials: Social[] = [
  {
    title: "GitHub",
    Icon: React.createElement(FaGithub, { className: "w-6 h-6" }),
    url: "https://github.com/ghostp13409",
  },
  {
    title: "LinkedIn",
    Icon: React.createElement(FaLinkedinIn, { color: "#1c71d8", className: "w-6 h-6" }),
    url: "https://www.linkedin.com/in/parth-gajjar09",
  },
  {
    title: "LeetCode",
    Icon: React.createElement(SiLeetcode, { color: "#ff7800", className: "w-6 h-6" }),
    url: "https://leetcode.com/u/ghostp134/",
  },
  {
    title: "Instagram",
    Icon: React.createElement(FaInstagram, { color: "#f66151", className: "w-6 h-6" }),
    url: "https://www.instagram.com/p_13_4/",
  },
];

export const inProgress: InProgressLearning[] = [
  {
    id: 1,
    title: "AZ-204: Azure Developer Associate",
    source: "Microsoft Certified: Azure Developer Associate",
    sourceUrl:
      "https://learn.microsoft.com/en-us/credentials/certifications/azure-developer/",
    sourcePlatform: "Microsoft",
    progress: 40,
  },
  {
    id: 2,
    title: "Kubernetes",
    source: "Getting Started with Kubernetes",
    sourceUrl: "https://www.linkedin.com/learning/paths/getting-started-with-kubernetes",
    sourcePlatform: "LinkedIn Learning",
    progress: 12,
  },
  {
    id: 3,
    title: "Spring MVC",
    source: "Spring MVC Tutorial Project For Beginners",
    sourceUrl: "https://www.youtube.com/playlist?list=PL82C6-O4XrHejlASdecIsroNEbZFYo_X1",
    sourcePlatform: "YouTube",
    progress: 47,
  },
];

export const Hobbies: Hobby[] = [
  {
    id: 1,
    title: "Doom Eternal ☠️",
    description:
      "Halo may be Infinite, but Doom is Eternal. I've finished it seven times and you'll probably find me playing it again.",
  },
  {
    id: 2,
    title: "Game Modding 🎮",
    description:
      "I love modding games, mostly Bethesda titles. I have 450 hours in Skyrim and roughly 400 of them were spent modding. My current obsession is Red Dead Redemption 2.",
  },
  {
    id: 3,
    title: "Distro Hopping 🐧",
    description:
      "Borderline obsessed with distro hopping. I've tried 20+ Linux distros and currently run Omarchy. I'm trying out Hyprland and really loving it.",
  },
  {
    id: 4,
    title: "Binge Watching 🎥",
    description:
      "I'd be lying if I said I watch a lot of new content. I mostly rewatch comfort shows. After seven runs of HIMYM and five of Game of Thrones, I'm on my third run of Prison Break.",
  },
  {
    id: 5,
    title: "Badminton 🏸",
    description:
      "I'm not only a screen junkie. I'm pretty good at badminton, though I haven't played in over a year and would love to get back on the court.",
  },
  {
    id: 6,
    title: "Swimming 🏊🏻‍♂️",
    description:
      "My instructor once told me I could compete nationally. That was a long time ago and I've been out of the pool for ages, but I still like to brag. I'm working on getting back into it.",
  },
];
