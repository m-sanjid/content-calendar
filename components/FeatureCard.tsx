"use client";

import {
  IconDragDrop,
  IconUsersGroup,
  IconReportAnalytics,
  IconSocial,
  IconGrain,
  IconRepeat,
} from "@tabler/icons-react";
import React from "react";
import { motion } from "framer-motion";

const FeatureCard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-2 max-w-4xl mx-auto my-10">
      {features.map((feature) => (
        <motion.div
          key={feature.id}
          initial={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 0.3, delay: feature.id * 0.1 }}
          whileHover={{ scale: 1.02, translateY: 10 }}
          className={`p-5 border rounded-sm shadow-lg col-span-${feature.span}`}
        >
          <motion.div
            initial={{ opacity: 1, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1.05 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex gap-2"
          >
            <div className="bg-black/10 p-2">{feature.icon}</div>
            <h1 className="text-xl font-bold">{feature.title}</h1>
          </motion.div>
          <p className="text-gray-600 mt-2">{feature.desc}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default FeatureCard;

const features = [
  {
    id: 1,
    title: "Drag-and-Drop Scheduling",
    desc: "Effortlessly plan and rearrange your content in our calendar interface.",
    icon: <IconDragDrop size={32} />,
    span: 8,
  },
  {
    id: 2,
    title: "Content Analytics",
    desc: "Gain insights into your content performance with detailed reports.",
    icon: <IconReportAnalytics size={32} />,
    span: 4,
  },
  {
    id: 3,
    title: "Team Collaboration",
    desc: "Collaborate with team members in real-time with shared access.",
    icon: <IconUsersGroup size={32} />,
    span: 4,
  },
  {
    id: 4,
    title: "Multi-Platform Publishing",
    desc: "Publish content to multiple platforms simultaneously with a single click.",
    icon: <IconSocial size={32} />,
    span: 8,
  },
  {
    id: 5,
    title: "Visual Planning",
    desc: "Visiualize your content with color coding, labels adn customizable views",
    icon: <IconGrain size={32} />,
    span: 6,
  },
  {
    id: 6,
    title: "Automated Workflows",
    desc: "Create custom workflows to automate your content creation and approval processess",
    icon: <IconRepeat size={32} />,
    span: 6,
  },
];
