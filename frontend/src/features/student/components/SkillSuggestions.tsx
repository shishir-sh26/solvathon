import { PlaySquare, Award, ExternalLink } from 'lucide-react';

// Mock data representing the AI's "Skill Gap" recommendations
const recommendedSkills = [
  {
    topic: "React & Framer Motion",
    reason: "Missing from your ATS Resume for UI/UX roles.",
    youtube: [
      { title: "React JS Full Course", channel: "Codevolution", link: "#" },
      { title: "Framer Motion Crash Course", channel: "Net Ninja", link: "#" }
    ],
    certs: [
      { title: "Meta Front-End Developer", provider: "Coursera", link: "#" }
    ],
    websites: [
      { title: "Frontend Mentor (Practice)", link: "#" }
    ]
  },
  {
    topic: "Data Structures & Algorithms",
    reason: "Required for 85% of pending recruiter drives.",
    youtube: [
      { title: "DSA in Python / C++", channel: "Striver (TakeUForward)", link: "#" }
    ],
    certs: [
      { title: "Algorithmic Toolbox", provider: "edX", link: "#" }
    ],
    websites: [
      { title: "LeetCode Grind 75", link: "#" },
      { title: "HackerRank Interview Prep", link: "#" }
    ]
  }
];

export default function SkillSuggestions() {
  return (
    <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h3 className="text-2xl font-black uppercase tracking-widest border-b-4 border-black pb-2 mb-6">
        Skill Gap Recommendations
      </h3>
      <p className="text-gray-600 font-bold mb-6">
        System Jarvis identified missing skills in your profile based on active market demand.
      </p>

      <div className="space-y-6">
        {recommendedSkills.map((skill, index) => (
          <div key={index} className="border-2 border-black p-4 bg-gray-50">
            <div className="flex justify-between items-start mb-4 border-b-2 border-dashed border-gray-400 pb-2">
              <h4 className="font-black text-lg uppercase tracking-wide">{skill.topic}</h4>
              <span className="bg-black text-white text-xs font-bold px-2 py-1 uppercase tracking-widest">
                High Priority
              </span>
            </div>
            <p className="text-sm font-bold text-red-600 mb-4 uppercase">
              Why: {skill.reason}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* YouTube Section */}
              <div className="border-2 border-black p-3 bg-white">
                <h5 className="font-bold uppercase flex items-center gap-2 mb-3 border-b-2 border-black pb-1">
                  <PlaySquare size={16} /> YouTube
                </h5>
                <ul className="space-y-2">
                  {skill.youtube.map((vid, vIdx) => (
                    <li key={vIdx} className="text-sm">
                      <a href={vid.link} className="font-bold hover:underline flex items-start gap-1">
                        <span className="truncate">{vid.title}</span>
                      </a>
                      <span className="text-xs text-gray-500 block">{vid.channel}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Certifications Section */}
              <div className="border-2 border-black p-3 bg-white">
                <h5 className="font-bold uppercase flex items-center gap-2 mb-3 border-b-2 border-black pb-1">
                  <Award size={16} /> Certifications
                </h5>
                <ul className="space-y-2">
                  {skill.certs.map((cert, cIdx) => (
                    <li key={cIdx} className="text-sm">
                      <a href={cert.link} className="font-bold hover:underline flex items-start gap-1">
                        <span className="truncate">{cert.title}</span>
                      </a>
                      <span className="text-xs text-gray-500 block">{cert.provider}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Practice Websites Section */}
              <div className="border-2 border-black p-3 bg-white">
                <h5 className="font-bold uppercase flex items-center gap-2 mb-3 border-b-2 border-black pb-1">
                  <ExternalLink size={16} /> Practice
                </h5>
                <ul className="space-y-2">
                  {skill.websites.map((site, sIdx) => (
                    <li key={sIdx} className="text-sm">
                      <a href={site.link} className="font-bold hover:underline">
                        {site.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}