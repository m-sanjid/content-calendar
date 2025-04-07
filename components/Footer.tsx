import React from "react";
import SocialLinks from "./SocialLinks";
import Link from "next/link";

const Footer = () => {
	return (
		<main className="border-t mt-20 pt-10 mx-auto max-w-6xl dark:border-neutral-600 w-full ">
			<div className="grid grid-cols-1 md:grid-cols-4">
				<div className="mt-6 space-y-2 col-span-1">
					<div className="font-bold text-xl mb-6">ContentCal</div>
					<div>
						<SocialLinks type={1} />
					</div>
				</div>
				<div className="md:col-span-3">
					<FooterCard />
				</div>
			</div>
			<footer className="text-sm flex justify-between items-center border-t p-4 mt-6 text-neutral-600 dark:text-neutral-300">
				<div>&copy; 2025 ContentCal. All rights reserved</div>
				<div className="font-light">
					Made by{" "}
					<Link
						href={"https://github.com/m-sanjid/content-calendar.git"}
						className="text-muted-foreground"
					>
						Muhammed Sanjid
					</Link>
					<SocialLinks type={2} />
				</div>
			</footer>
		</main>
	);
};

export default Footer;

export const FooterCard = () => {
	return (
		<div className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6">
			{FooterItems.map((i) => (
				<div key={i.title}>
					<div className="font-bold">{i.title}</div>
					<ul className="flex flex-col gap-2 mt-2">
						{i.list.map((l) => (
							<Link href={l.href} key={l.name}>
								<li className="text-sm text-muted-foreground">{l.name}</li>
							</Link>
						))}
					</ul>
				</div>
			))}
		</div>
	);
};

const FooterItems = [
	{
		title: "Product",
		list: [
			{ name: "Features", href: "#features" },
			{ name: "Demo", href: "#demo" },
			{ name: "Pricing", href: "/pricing" },
			{ name: "Integration", href: "#integration" },
			{ name: "API", href: "/documentation/api" },
		],
	},
	{
		title: "Resources",
		list: [
			{ name: "Documentation", href: "/documentation" },
			{ name: "Guide", href: "#guide" },
			{ name: "Blog", href: "/blog" },
			{ name: "Support", href: "/support" },
			{ name: "Webinars", href: "#" },
		],
	},
	{
		title: "Company",
		list: [
			{ name: "About", href: "/about" },
			{ name: "Careers", href: "/careers" },
			{ name: "Privacy", href: "/privacy" },
			{ name: "Terms", href: "/terms" },
			{ name: "Contact", href: "/contact" },
		],
	},
];
