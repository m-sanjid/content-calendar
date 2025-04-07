"use client";

import React from "react";
import { Button } from "./ui/button";
import { IconCheck } from "@tabler/icons-react";
import { motion } from "motion/react";

const PricingCard = () => {
	return (
		<div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
				{price.map((i) => (
					<motion.div
						key={i.title}
						className={`relative ${i.title === "Professional" ? "bg-neutral-800 text-white" : "bg-inherit dark:bg-white/5"} py-10 px-4 flex flex-col items-center rounded-md shadow-2xl`}
					>
						<div>
							<h1 className="font-bold text-xl mb-2">{i.title}</h1>
							<p className="text-muted-foreground text-sm">{i.desc}</p>
							<div className="text-3xl font-bold py-2 mb-4">
								{i.price}
								<span className="text-muted-foreground text-xl font-medium">
									{i.price !== "Custom" ? "/month" : ""}
								</span>
							</div>
							<ul className="space-y-2 mb-8">
								{i.features.map((f) => (
									<li key={f} className="flex gap-2 items-center">
										<IconCheck
											size={16}
											className="rounded-full bg-green-500 ring text-white p-px"
										/>
										{f}
									</li>
								))}
							</ul>
						</div>
						<div className="absolute bottom-6">
							<Button
								className={`rounded-full px-8 mx-auto ${i.title === "Professional" && "dark:bg-black"}`}
								variant={i.title === "Professional" ? "secondary" : "default"}
							>
								{i.price !== "Custom" ? "Buy Now" : "Contact Us"}
							</Button>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	);
};

export default PricingCard;

const price = [
	{
		title: "Starter",
		price: 9.99,
		desc: "Perfect for individuals and small teams",
		features: [
			"Basic content calendar",
			"Up to 3 team members",
			"Basic analytics",
			"Social media integration",
			"email support",
		],
	},
	{
		title: "Professional",
		price: 29.99,
		desc: "Ideal for growing teams and businesses",
		features: [
			"Advanced Content Calendar",
			"Upto 10 team members",
			"Advanced analytics",
			"All social media integration",
			"Custom workflows",
			"Content approval process",
			"priority email support",
		],
	},
	{
		title: "Enterprise",
		price: "Custom",
		desc: "For large organizations and agencies",
		features: [
			"All professional features",
			"Unlimited content calendars",
			"Unlimited team members",
			"Advanced analytics and reporting",
			"Custom integration",
			"Dedicated account manager",
			"API access",
			"SSO suthentication",
		],
	},
];
