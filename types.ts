import type { ReactElement } from "react";

export enum ComponentType {
	Heading = "Heading",
	Button = "Button",
	Input = "Input",
	Card = "Card",
	Hero = "Hero",
	Section = "Section",
}

export interface BaseProps {
	[key: string]: any;
	width?: string;
	height?: string;
	x?: number;
	y?: number;
}

export interface HeadingProps extends BaseProps {
	text: string;
	level: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface ButtonProps extends BaseProps {
	text: string;
	variant: "primary" | "secondary" | "outline";
	link?: {
		type: "url" | "section" | "none";
		value: string;
		target?: "_blank" | "_self";
	};
}

export interface InputProps extends BaseProps {
	placeholder: string;
	type: "text" | "email" | "password";
}

export interface CardProps extends BaseProps {
	title: string;
	description: string;
	imageUrl: string;
	link?: {
		type: "url" | "section" | "none";
		value: string;
		target?: "_blank" | "_self";
	};
}

export interface HeroProps extends BaseProps {
	title: string;
	subtitle: string;
	ctaText: string;
	ctaLink?: {
		type: "url" | "section" | "none";
		value: string;
		target?: "_blank" | "_self";
	};
}

export interface SectionProps extends BaseProps {
	name: string;
	id: string;
	backgroundColor?: string;
	padding?: string;
}

export type ComponentProps =
	| HeadingProps
	| ButtonProps
	| InputProps
	| CardProps
	| HeroProps
	| SectionProps;

export interface CanvasComponent {
	id: string;
	type: ComponentType;
	props: ComponentProps;
	position?: {
		x: number;
		y: number;
	};
	size?: {
		width: string;
		height: string;
	};
	sectionId?: string; // Which section this component belongs to
}

export interface Section {
	id: string;
	name: string;
	backgroundColor?: string;
	padding?: string;
	minHeight?: string;
	components: CanvasComponent[];
}

export interface AvailableComponent {
	type: ComponentType;
	name: string;
	icon: ReactElement;
	defaultProps: ComponentProps;
}

export interface ChatMessage {
	role: "user" | "model";
	text: string;
}
