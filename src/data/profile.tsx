import { Github, Linkedin, Instagram } from "lucide-react";
import { SiLeetcode } from "react-icons/si";
import type { Social, InProgressLearning, Hobby } from "../types/portfolio";
import React from "react";

export const socials: Social[] = [
  {
    title: "Github",
    Icon: React.createElement(Github, { className: "w-6 h-6" }),
    url: "https://www.github.com/ghostp13409",
  },
  {
    title: "LinkedIn",
    Icon: React.createElement(Linkedin, { color: "#1c71d8", className: "w-6 h-6" }),
    url: "https://www.linkedin.com/in/parth-gajjar09",
  },
  {
    title: "LeetCode",
    Icon: React.createElement(SiLeetcode, { color: "#ff7800", className: "w-6 h-6" }),
    url: "https://www.leetcode.com/ghostp134",
  },
  {
    title: "Instagram",
    Icon: React.createElement(Instagram, { color: "#f66151", className: "w-6 h-6" }),
    url: "https://www.instagram.com/p_13_4/profilecard/?igsh=MTBrbThrNHc1aWR3NA==",
  },
];

export const inProgress: InProgressLearning[] = [
  {
    id: 1,
    title: "AZ-204: Azure Developer Associate",
    source: "Microsoft Certified: Azure Developer Associate",
    sourceUrl:
      "https://learn.microsoft.com/en-us/credentials/certifications/azure-developer/?practice-assessment-type=certification",
    sourcePlatform: "Microsoft",
    progress: "40%",
  },
  {
    id: 2,
    title: "Kubernetes",
    source: "Getting Started with Kubernetes",
    sourceUrl:
      "https://www.linkedin.com/learning/paths/getting-started-with-kubernetes",
    sourcePlatform: "LinkedIn Learning",
    progress: "12%",
  },
  {
    id: 3,
    title: "Spring MVC",
    source: "Spring MVC Tutorial Project For Beginners",
    sourceUrl:
      "https://www.youtube.com/playlist?list=PL82C6-O4XrHejlASdecIsroNEbZFYo_X1",
    sourcePlatform: "YouTube",
    progress: "47%",
  },
];

export const Hobbies: Hobby[] = [
  {
    id: 1,
    title: "Doom Eternal ☠️",
    imageUrl: "images/hobbies/doom.jpg",
    description:
      "Halo maybe infinite, but Doom is Eternal. I've played it 7 times and you'll probably find me playing it again.",
  },
  {
    id: 2,
    title: "Game Modding 🎮",
    imageUrl: "images/hobbies/modding.jpg",
    description:
      "I love modding games. Mostly Bathesda games. I got 450 hrs in skyrim and 400 of them would most probably be modding. My current obsession is rdr2.",
  },
  {
    id: 3,
    title: "Distro Hopping 🐧",
    imageUrl: "images/hobbies/linux.jpg",
    description:
      "Borderline obsessed with Distro hopping. I've tried 20+ distros and I'm currently using Omarchy. I'm trying out hyprland and really loving it!",
  },
  {
    id: 4,
    title: "Binge Watching 🎥",
    imageUrl: "images/hobbies/netflix.jpg",
    description:
      "It would be a lie if I said I watch a lot of new content. I just re-watch my comfort shows. After 7th run of HIMYM and 5th run of GOT, I'm currently on my 3rd run of Prison Break.",
  },
  {
    id: 5,
    title: "Badminton 🏸",
    imageUrl: "images/hobbies/badminton.jpg",
    description:
      "That's right, I'm not only a screen junkie. I love some Sports too. I'm pretty good at badminton. However, havn't played it over a year now. Would love to play again.",
  },
  {
    id: 6,
    title: "Swimming 🏊🏻‍♂️",
    imageUrl: "images/hobbies/swimming.jpg",
    description:
      "I love swimming. My instructor told me I could go national. That was a long time ago and I've quit swimmning since ages, but I still like to brag. I'm trying to get back into it.",
  },
];
