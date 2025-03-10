import React from "react";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="py-8 text-white bg-gradient-to-r from-blue-800 to-gray-900">
      <div className="container px-6 mx-auto">
        <div className="flex flex-col items-center justify-between md:flex-row">
          {/* Left Section */}
          <div className="mb-6 text-center md:text-left md:mb-0">
            <h2 className="text-2xl font-bold text-white">
              <span className="text-blue-400">Job</span>Hunt
            </h2>
            <p className="mt-1 text-sm text-blue-100">
              © 2025 JobHunt. All rights reserved.
            </p>
          </div>

          {/* Center Links - New Addition */}
          <div className="hidden mb-6 md:flex md:mb-0">
            <ul className="flex space-x-8">
              {["About", "Jobs", "Contact", "Privacy", "Terms"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-sm text-gray-300 transition-colors hover:text-white hover:underline"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="flex space-x-4">
            {socialLinks.map(({ href, label, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-300 transition-colors rounded-full hover:text-white hover:bg-blue-700"
                aria-label={label}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

const socialLinks = [
  {
    label: "Facebook",
    icon: <Facebook className="w-4 h-4" />,
    href: "https://www.facebook.com", // Add the link for Facebook
  },
  {
    label: "Twitter",
    icon: <Twitter className="w-4 h-4" />,
    href: "https://www.twitter.com", // Add the link for Twitter
  },
  {
    label: "LinkedIn",
    icon: <Linkedin className="w-4 h-4" />,
    href: "https://www.linkedin.com", // Add the link for LinkedIn
  },
  {
    label: "Instagram",
    icon: <Instagram className="w-4 h-4" />,
    href: "https://www.instagram.com", // Add the link for Instagram
  },
];

export default Footer;
