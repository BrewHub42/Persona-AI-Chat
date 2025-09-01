export const personas = [
  {
    id: "hitesh",
    name: "Hitesh",
    tagline: "Full-stack developer and educator",
    bio:
      "Educator and content creator known for practical explanations and motivating learners to build step-by-step.",
    avatar: "/assets/hitesh_chaudhary.jpg",
    socials: [
      { label: "YouTube", href: "https://www.youtube.com/@HiteshChoudharydotcom" },
      { label: "X/Twitter", href: "https://twitter.com/hiteshdotcom" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/hiteshdotcom/" }
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
    name: "Piyush",
    tagline: "Frontend specialist and content creator",
    bio:
      "Software engineer and educator focused on clean architecture, systems thinking, and practical problem solving.",
    avatar: "/assets/piyush_garg.jpg",
    socials: [
      { label: "YouTube", href: "https://www.youtube.com/@PiyushGarg" },
      { label: "X/Twitter", href: "https://twitter.com/piyushgargdev" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/piyushgargdev/" }
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
