"use client";
import { ThemeSwitcher } from "@/components/layout/ThemeSwitcher";
import {
	MobileNav,
	MobileNavHeader,
	MobileNavMenu,
	MobileNavToggle,
	Navbar,
	NavbarButton,
	NavbarLogo,
	NavBody,
	NavItems,
} from "@/components/ui/navbar";
import { useState } from "react";

const NAV_ITEMS = [
	{
		name: "Dev Blog",
		link: "/dev-log",
	},
	{
		name: "Games",
		link: "/games",
	},
	{
		name: "Careers",
		link: "/careers",
	},
];

export function Header({ children }: { children: React.ReactNode }) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	return (
		<div className="relative w-full">
			<Navbar>
				{/* Desktop Navigation */}
				<NavBody>
					<NavbarLogo />
					<NavItems items={NAV_ITEMS} />
					<div className="flex items-center gap-4">
						<ThemeSwitcher />
						{/* <NavbarButton variant="secondary">Login</NavbarButton> */}
						<NavbarButton variant="primary">
							Contact Us
						</NavbarButton>
					</div>
				</NavBody>

				{/* Mobile Navigation */}
				<MobileNav>
					<MobileNavHeader>
						<NavbarLogo />
						<MobileNavToggle
							isOpen={isMobileMenuOpen}
							onClick={() =>
								setIsMobileMenuOpen(!isMobileMenuOpen)
							}
						/>
					</MobileNavHeader>

					<MobileNavMenu
						isOpen={isMobileMenuOpen}
						onClose={() => setIsMobileMenuOpen(false)}
					>
						{NAV_ITEMS.map((item, idx) => (
							<a
								key={`mobile-link-${idx}`}
								href={item.link}
								onClick={() => setIsMobileMenuOpen(false)}
								className="relative text-neutral-600 dark:text-neutral-300"
							>
								<span className="block">{item.name}</span>
							</a>
						))}
						<div className="flex w-full flex-col gap-4">
							<NavbarButton
								onClick={() => setIsMobileMenuOpen(false)}
								variant="primary"
								className="w-full"
							>
								Login
							</NavbarButton>
							<NavbarButton
								onClick={() => setIsMobileMenuOpen(false)}
								variant="primary"
								className="w-full"
							>
								Book a call
							</NavbarButton>
						</div>
					</MobileNavMenu>
				</MobileNav>
			</Navbar>

			{/* Main Content Area */}
			<div className="container mx-auto p-8 pt-24">{children}</div>
		</div>
	);
}
