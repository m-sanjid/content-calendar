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
import { motion } from "motion/react";

type Props = {
  feature: {
    id: number;
    title: string;
    desc: string;
    icon: React.ReactNode;
  };
  colSpan: string;
  rowSpan: string;
  delay: number;
};

const FeatureCardItem = ({ feature, colSpan, rowSpan, delay }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.1 }}
      whileHover={{ scale: 1.02, translateY: 10, translateX: 2 }}
      className={`p-5 border border-gray-200 rounded-lg shadow-lg col-span-1 ${colSpan} ${rowSpan}`}
    >
      <motion.div
        initial={{ opacity: 1, scale: 0.9 }}
        whileHover={{ opacity: 1, scale: 1.05 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex items-center gap-2 "
      >
        <div className={`p-2 rounded-md`}>{feature.icon}</div>
        <h1 className="font-bold text-xl">{feature.title}</h1>
      </motion.div>
      <p className={`mt-2 text-neutral-600`}>{feature.desc}</p>
    </motion.div>
  );
};

const FeatureCard = () => {
  const cardConfigs = [
    {
      colSpan: "md:col-span-4",
      rowSpan: "md:row-span-2",
    },
    {
      colSpan: "md:col-span-8",
      rowSpan: "",
    },
    {
      colSpan: "md:col-span-6",
      rowSpan: "",
    },
    {
      colSpan: "md:col-span-2",
      rowSpan: "md:row-span-2",
    },
    {
      colSpan: "md:col-span-4",
      rowSpan: "",
    },
    {
      colSpan: "md:col-span-6",
      rowSpan: "",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto my-10 px-4 w-full">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-auto">
        {features.map((feature, index) => (
          <FeatureCardItem
            key={feature.id}
            feature={feature}
            colSpan={cardConfigs[index].colSpan}
            rowSpan={cardConfigs[index].rowSpan}
            delay={feature.id}
          />
        ))}
      </div>
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
  },
  {
    id: 2,
    title: "Content Analytics",
    desc: "Gain insights into your content performance with detailed reports.",
    icon: <IconReportAnalytics size={32} />,
  },
  {
    id: 3,
    title: "Team Collaboration",
    desc: "Collaborate with team members in real-time with shared access.",
    icon: <IconUsersGroup size={32} />,
  },
  {
    id: 4,
    title: "Multi-Platform Publishing",
    desc: "Publish content to multiple platforms simultaneously with a single click.",
    icon: <IconSocial size={32} />,
  },
  {
    id: 5,
    title: "Visual Planning",
    desc: "Visualize your content with color coding, labels and customizable views.",
    icon: <IconGrain size={32} />,
  },
  {
    id: 6,
    title: "Automated Workflows",
    desc: "Create custom workflows to automate your content creation and approval processes.",
    icon: <IconRepeat size={32} />,
  },
];
