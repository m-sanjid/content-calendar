import React from "react";
import { motion } from "motion/react";

const Demo = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative mt-12 group">
        <motion.h1
          initial={{ opacity: 0, translateY: 20 }}
          whileInView={{ opacity: 1, translateY: -10 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-muted-foreground text-5xl lg:text-8xl group-hover:-translate-y-2 ease-in-out duration-300"
        >
          SneekPeak to Cal
        </motion.h1>

        {/* TODO: add demo image */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="bg-white w-full h-[600px] -mt-3 lg:-mt-6 p-2 rounded-3xl border ring ring-neutral-200 shadow-2xl border-neutral-200 relative"
        >
          <div className="bg-black rounded-2xl w-full h-full border-2 border-neutral-200" />
        </motion.div>
      </div>
    </div>
  );
};

export default Demo;
