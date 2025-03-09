import React from "react";
import PricingCard from "./PricingCard";

//TODO:add subscribtion logic to button

const Pricing = () => {
	return (
		<div className="">
			<div className="my-10 text-center">
				<h1 className="text-2xl font-semibold my-4">
					Simple, transparent pricing
				</h1>
				<p className="text-muted-foreground ">
					Choose the plan that best fits your needs. All plans include a 14-day
					free trial.
				</p>
			</div>
			<div>
				<PricingCard />
			</div>
		</div>
	);
};

export default Pricing;
