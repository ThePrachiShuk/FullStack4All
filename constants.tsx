import React from "react";
import { ComponentType, AvailableComponent } from "./types";
import { Icon } from "./components/Icon";

export const AVAILABLE_COMPONENTS: AvailableComponent[] = [
	{
		type: ComponentType.Section,
		name: "Section",
		icon: <Icon name="section" className="w-8 h-8 text-indigo-400" />,
		defaultProps: {
			name: "New Section",
			id: `section-${Date.now()}`,
			backgroundColor: "#1e293b",
			padding: "4rem 1rem",
		},
	},
	{
		type: ComponentType.Hero,
		name: "Hero Section",
		icon: <Icon name="hero" className="w-8 h-8 text-indigo-400" />,
		defaultProps: {
			title: "Welcome to Your Website",
			subtitle: "This is a powerful hero section to grab attention.",
			ctaText: "Get Started",
			ctaLink: {
				type: "none",
				value: "",
				target: "_self",
			},
		},
	},
	{
		type: ComponentType.Heading,
		name: "Heading",
		icon: <Icon name="heading" className="w-8 h-8 text-indigo-400" />,
		defaultProps: {
			text: "Main Heading",
			level: 1,
		},
	},
	{
		type: ComponentType.Button,
		name: "Button",
		icon: <Icon name="button" className="w-8 h-8 text-indigo-400" />,
		defaultProps: {
			text: "Click Me",
			variant: "primary",
			link: {
				type: "none",
				value: "",
				target: "_self",
			},
		},
	},
	{
		type: ComponentType.Input,
		name: "Text Input",
		icon: <Icon name="input" className="w-8 h-8 text-indigo-400" />,
		defaultProps: {
			placeholder: "Enter text here...",
			type: "text",
		},
	},
	{
		type: ComponentType.Card,
		name: "Card",
		icon: <Icon name="card" className="w-8 h-8 text-indigo-400" />,
		defaultProps: {
			title: "Feature Card",
			description: "Describe a cool feature of your product or service here.",
			imageUrl: `https://picsum.photos/400/200?random=${Math.floor(
				Math.random() * 100
			)}`,
			link: {
				type: "none",
				value: "",
				target: "_self",
			},
		},
	},
];
