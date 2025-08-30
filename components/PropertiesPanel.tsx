import React from "react";
import { CanvasComponent, ComponentType, Section } from "../types";

interface PropertiesPanelProps {
	selectedComponent: CanvasComponent | null;
	sections: Section[];
	onUpdateProps: (id: string, newProps: any) => void;
	selectedSection?: Section | null;
	onUpdateSection?: (id: string, updates: Partial<Section>) => void;
}

const PropInput: React.FC<{
	label: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	type?: string;
}> = ({ label, value, onChange, type = "text" }) => (
	<div>
		<label className="block text-sm font-medium text-slate-400 mb-1">
			{label}
		</label>
		<input
			type={type}
			value={value}
			onChange={onChange}
			className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:ring-indigo-500 focus:border-indigo-500"
		/>
	</div>
);

const PropSelect: React.FC<{
	label: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	options: { value: string; label: string }[];
}> = ({ label, value, onChange, options }) => (
	<div>
		<label className="block text-sm font-medium text-slate-400 mb-1">
			{label}
		</label>
		<select
			value={value}
			onChange={onChange}
			className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500"
		>
			{options.map((opt) => (
				<option key={opt.value} value={opt.value}>
					{opt.label}
				</option>
			))}
		</select>
	</div>
);

const PropTextArea: React.FC<{
	label: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	rows?: number;
}> = ({ label, value, onChange, rows = 3 }) => (
	<div>
		<label className="block text-sm font-medium text-slate-400 mb-1">
			{label}
		</label>
		<textarea
			rows={rows}
			value={value}
			onChange={onChange}
			className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:ring-indigo-500 focus:border-indigo-500"
		/>
	</div>
);

const LinkEditor: React.FC<{
	label: string;
	link: any;
	onChange: (link: any) => void;
	sections: Section[];
}> = ({ label, link, onChange, sections }) => (
	<div className="space-y-2">
		<label className="block text-sm font-medium text-slate-400">{label}</label>
		<PropSelect
			label="Link Type"
			value={link?.type || "none"}
			onChange={(e) => onChange({ ...link, type: e.target.value })}
			options={[
				{ value: "none", label: "No Link" },
				{ value: "url", label: "External URL" },
				{ value: "section", label: "Page Section" },
			]}
		/>
		{link?.type === "url" && (
			<>
				<PropInput
					label="URL"
					value={link?.value || ""}
					onChange={(e) => onChange({ ...link, value: e.target.value })}
				/>
				<PropSelect
					label="Target"
					value={link?.target || "_self"}
					onChange={(e) => onChange({ ...link, target: e.target.value })}
					options={[
						{ value: "_self", label: "Same Tab" },
						{ value: "_blank", label: "New Tab" },
					]}
				/>
			</>
		)}
		{link?.type === "section" && (
			<PropSelect
				label="Section"
				value={link?.value || ""}
				onChange={(e) => onChange({ ...link, value: e.target.value })}
				options={[
					{ value: "", label: "Select Section..." },
					...sections.map((section) => ({
						value: section.id,
						label: section.name,
					})),
				]}
			/>
		)}
	</div>
);

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
	selectedComponent,
	sections,
	onUpdateProps,
	selectedSection,
	onUpdateSection,
}) => {
	if (!selectedComponent) {
		return (
			<div className="w-80 h-full bg-slate-800 p-4 border-l border-slate-700 flex flex-col">
				<h2 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
						/>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
					Properties
				</h2>
				<div className="flex-1 flex items-center justify-center">
					<div className="text-center py-8">
						<svg
							className="w-12 h-12 mx-auto mb-3 text-slate-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
						<p className="text-slate-400 mb-2">
							Select a component on the canvas to edit its properties.
						</p>
						<p className="text-xs text-slate-500 flex items-center justify-center gap-1">
							<svg
								className="w-3 h-3"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
								/>
							</svg>
							Click any component to customize it
						</p>
					</div>
				</div>
			</div>
		);
	}

	const { id, type, props } = selectedComponent;

	const handleChange = (propName: string, value: any) => {
		onUpdateProps(id, { ...props, [propName]: value });
	};

	const renderProps = () => {
		switch (type) {
			case ComponentType.Hero:
				return (
					<>
						<PropInput
							label="Title"
							value={props.title}
							onChange={(e) => handleChange("title", e.target.value)}
						/>
						<PropInput
							label="Subtitle"
							value={props.subtitle}
							onChange={(e) => handleChange("subtitle", e.target.value)}
						/>
						<PropInput
							label="CTA Button Text"
							value={props.ctaText}
							onChange={(e) => handleChange("ctaText", e.target.value)}
						/>
						<LinkEditor
							label="CTA Link"
							link={props.ctaLink}
							onChange={(link) => handleChange("ctaLink", link)}
							sections={sections}
						/>
					</>
				);
			case ComponentType.Heading:
				return (
					<>
						<PropInput
							label="Text"
							value={props.text}
							onChange={(e) => handleChange("text", e.target.value)}
						/>
						<PropSelect
							label="Level"
							value={String(props.level)}
							onChange={(e) =>
								handleChange("level", parseInt(e.target.value, 10))
							}
							options={[1, 2, 3, 4, 5, 6].map((i) => ({
								value: String(i),
								label: `H${i}`,
							}))}
						/>
					</>
				);
			case ComponentType.Button:
				return (
					<>
						<PropInput
							label="Text"
							value={props.text}
							onChange={(e) => handleChange("text", e.target.value)}
						/>
						<PropSelect
							label="Variant"
							value={props.variant}
							onChange={(e) => handleChange("variant", e.target.value)}
							options={[
								{ value: "primary", label: "Primary" },
								{ value: "secondary", label: "Secondary" },
								{ value: "outline", label: "Outline" },
							]}
						/>
						<LinkEditor
							label="Button Link"
							link={props.link}
							onChange={(link) => handleChange("link", link)}
							sections={sections}
						/>
					</>
				);
			case ComponentType.Input:
				return (
					<>
						<PropInput
							label="Placeholder"
							value={props.placeholder}
							onChange={(e) => handleChange("placeholder", e.target.value)}
						/>
						<PropSelect
							label="Type"
							value={props.type}
							onChange={(e) => handleChange("type", e.target.value)}
							options={[
								{ value: "text", label: "Text" },
								{ value: "email", label: "Email" },
								{ value: "password", label: "Password" },
							]}
						/>
					</>
				);
			case ComponentType.Card:
				return (
					<>
						<PropInput
							label="Title"
							value={props.title}
							onChange={(e) => handleChange("title", e.target.value)}
						/>
						<PropInput
							label="Description"
							value={props.description}
							onChange={(e) => handleChange("description", e.target.value)}
						/>
						<PropInput
							label="Image URL"
							value={props.imageUrl}
							onChange={(e) => handleChange("imageUrl", e.target.value)}
						/>
						<LinkEditor
							label="Card Link"
							link={props.link}
							onChange={(link) => handleChange("link", link)}
							sections={sections}
						/>
					</>
				);
			case ComponentType.Section:
				return (
					<>
						<PropInput
							label="Section Name"
							value={props.name}
							onChange={(e) => handleChange("name", e.target.value)}
						/>
						<PropInput
							label="Background Color"
							value={props.backgroundColor || "#1e293b"}
							onChange={(e) => handleChange("backgroundColor", e.target.value)}
							type="color"
						/>
						<PropInput
							label="Padding"
							value={props.padding || "2rem 1rem"}
							onChange={(e) => handleChange("padding", e.target.value)}
						/>
					</>
				);
			default:
				return (
					<p className="text-slate-500">
						No editable properties for this component.
					</p>
				);
		}
	};

	const getComponentIcon = (type: ComponentType) => {
		switch (type) {
			case ComponentType.Button:
				return (
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
						/>
					</svg>
				);
			case ComponentType.Input:
				return (
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
						/>
					</svg>
				);
			case ComponentType.Card:
				return (
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
						/>
					</svg>
				);
			case ComponentType.Hero:
				return (
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
						/>
					</svg>
				);
			default:
				return (
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
						/>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
				);
		}
	};

	return (
		<div className="w-80 h-full bg-slate-800 p-4 border-l border-slate-700 flex flex-col">
			<h2 className="text-lg font-bold text-slate-300 flex items-center gap-2 mb-4">
				{getComponentIcon(type)} Properties:{" "}
				<span className="text-indigo-400">{type}</span>
			</h2>
			<div className="space-y-4 flex-1 overflow-y-auto">{renderProps()}</div>
		</div>
	);
};
