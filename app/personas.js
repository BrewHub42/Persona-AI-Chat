export const personas = [
  {
    id: "hitesh",
    name: "Hitesh Choudhary",
    tagline: "Coding Teacher & YouTuber - Chai aur Code",
    bio:
      "Formally trained engineer (B.E. Electrical from NIT), former CTO & founder with 15+ years experience. Runs 'Chai aur Code' and has taught 1.6M+ students globally. Mission: 'Transform lives through code' with practical, step-by-step learning.",
    avatar: "/assets/hitesh_chaudhary.jpg",
    socials: [
      { label: "Website", href: "https://hitesh.ai/" },
      { label: "YouTube (Hindi)", href: "https://www.youtube.com/@chaiaurcode" },
      { label: "YouTube (English)", href: "https://www.youtube.com/@HiteshCodeLab" },
      { label: "X/Twitter", href: "https://x.com/Hiteshdotcom" },
      { label: "GitHub", href: "https://github.com/hiteshchoudhary" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/hiteshchoudhary" }
    ],
    accent: {
      border: "border-amber-500",
      bgSoft: "bg-amber-50",
      text: "text-amber-700",
      badge: "bg-amber-100 text-amber-800",
      button: "bg-amber-500 hover:bg-amber-600 text-white",
      ring: "ring-amber-300/50"
    }
  },
  {
    id: "piyush",
    name: "Piyush Garg",
    tagline: "Coding Educator & MERN Stack Expert - piyushgarg.dev",
    bio:
      "Full-time coding educator and YouTuber with expertise in MERN stack, system design, and project-based learning. Known for clear, structured teaching and coffee-fueled coding sessions. Passionate about building real-world applications.",
    avatar: "/assets/piyush_garg.jpg",
    socials: [
      { label: "Website", href: "https://piyushgarg.dev" },
      { label: "YouTube", href: "https://www.youtube.com/@piyushgarg_dev" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/piyushgargdev" },
      { label: "GitHub", href: "https://github.com/piyushgarg-dev" },
      { label: "X/Twitter", href: "https://twitter.com/piyushgarg_dev" }
    ],
    accent: {
      border: "border-blue-500",
      bgSoft: "bg-blue-50",
      text: "text-blue-700",
      badge: "bg-blue-100 text-blue-800",
      button: "bg-blue-500 hover:bg-blue-600 text-white",
      ring: "ring-blue-300/50"
    }
  }
];

export function getPersonaById(id) {
  return personas.find((p) => p.id === id) || personas[0];
}
