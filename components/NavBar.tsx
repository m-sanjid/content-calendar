"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import {
	IconCalendar,
	IconMenu,
	IconMoon,
	IconSun,
	IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import AuthButton from "./AuthButton";


interface HoverPosition {
	left: number;
	width: number;
}

interface NavItem {
	path: string;
	label: string;
}

export const navItems: NavItem[] = [
	{ path: "/", label: "Home" },
	{ path: "/about", label: "About" },
	{ path: "/user/calendar", label: "Calendar" },
	{ path: "/pricing", label: "Pricing" },
	{ path: "/contact", label: "Contact" },
];

const Navbar = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [isHovered, setIsHovered] = useState<boolean>(false);
	const [hoverPosition, setHoverPosition] = useState<HoverPosition>({
		left: 0,
		width: 0,
	});
	const pathname = usePathname();
	const { theme, setTheme, resolvedTheme } = useTheme();
	const { scrollY } = useScroll();
	const [isScrolled, setIsScrolled] = useState(false);

	// Detect scroll position
	useMotionValueEvent(scrollY, "change", (latest) => {
		setIsScrolled(latest > 0);
	});

	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	const toggleTheme = () => {
		setTheme(resolvedTheme === "dark" ? "light" : "dark");
	};

	if (!mounted) return null;

	const handleHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
		const { offsetLeft, offsetWidth } = e.currentTarget;
		setHoverPosition({ left: offsetLeft, width: offsetWidth });
		setIsHovered(true);
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
	};

	return (
		<div className="relative flex justify-center z-10 h-16">
			<motion.nav
				className={`fixed top-4 mx-auto inset-x-0 w-[95%] max-w-7xl rounded-full z-50 ${isScrolled ? "bg-neutral-50/70 dark:bg-neutral-900/80 backdrop-blur-2xl shadow-[0px_-4px_6px_0px_var(--neutral-100),0px_4px_6px_0px_var(--neutral-100)] dark:shadow-[0px_-4px_6px_0px_var(--neutral-800),0px_4px_6px_0px_var(--neutral-800)]" : ""}`}
				onMouseLeave={handleMouseLeave}
			>
				<div className="container mx-auto px-8 py-2">
					<div className="flex items-center justify-between">
						{/* TODO:add logo */}
						<Link href="/" className="text-xl font-semibold">
							<IconCalendar />
						</Link>

						{/* Desktop Navigation */}
						<div className="hidden md:flex items-center space-x-8 relative">
							{navItems.map((item) => (
								<Link
									key={item.path}
									href={item.path}
									onMouseEnter={handleHover}
									className={`transition-colors z-20 hover:text-primary relative py-1 px-2 rounded-lg ${
										pathname === item.path
											? "text-primary font-medium"
											: "text-muted-foreground"
									}`}
								>
									{item.label}
								</Link>
							))}
							<button
								onClick={toggleTheme}
								className="p-2 rounded-full hover:bg-accent transition-colors"
								aria-label="Toggle theme"
							>
								{theme === "dark" ? (
									<IconSun size={20} />
								) : (
									<IconMoon size={20} />
								)}
							</button>
							<AuthButton/>

							{/* Hover Effect */}
							{isHovered && (
								<motion.div
									className="absolute p-4 z-10 bg-black/10 dark:bg-white/10 rounded-lg"
									initial={false}
									animate={{
										left: hoverPosition.left,
										width: hoverPosition.width,
										opacity: 1,
									}}
									exit={{ opacity: 0 }}
									transition={{ type: "spring", stiffness: 300, damping: 20 }}
								/>
							)}
						</div>

						{/* Mobile Navigation */}
						<div className="md:hidden flex items-center">
							<button
								onClick={toggleTheme}
								className="p-2 rounded-full hover:bg-accent transition-colors mr-2"
								aria-label="Toggle theme"
							>
								{theme === "dark" ? (
									<IconSun size={20} />
								) : (
									<IconMoon size={20} />
								)}
							</button>
							<button
								onClick={() => setIsOpen(!isOpen)}
								className="p-2 rounded-full hover:bg-accent transition-colors"
								aria-label="Toggle menu"
							>
								{isOpen ? <IconX size={20} /> : <IconMenu size={20} />}
							</button>
						</div>
					</div>

					{/* Mobile Menu */}
					{isOpen && (
						<div className="md:hidden absolute top-16 left-0 w-full animate-fade-in">
							<div className="px-4 py-2 bg-background/95 backdrop-blur-sm rounded-b-lg shadow-lg space-y-2">
								{navItems.map((item) => (
									<Link
										key={item.path}
										href={item.path}
										onClick={() => setIsOpen(false)}
										className={`block py-2 transition-colors ${
											pathname === item.path
												? "text-primary font-medium"
												: "text-muted-foreground"
										}`}
									>
										{item.label}
									</Link>
								))}
							</div>
						</div>
					)}
				</div>
			</motion.nav>
		</div>
	);
};

export default Navbar;
