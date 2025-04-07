import React from "react";
import FeatureCard from "./FeatureCard";

const Features = () => {
  return (
    <div className="my-20 mx-auto w-full">
      <div>
        <h1 className="text-2xl font-semibold text-center mb-6">
          Everything you need for content planning
        </h1>
        <p className="text-center text-muted-foreground mb-4">
          Our platform provides all the tools you need to plan, create, and
          publish your content efficiently
        </p>
      </div>
      <div>
        <FeatureCard />
      </div>
    </div>
  );
};

export default Features;
