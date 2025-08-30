import React, { useState } from "react";
import { AVAILABLE_COMPONENTS } from "../constants";
import { ComponentType, Section } from "../types";

interface ComponentPaletteProps {
	onAddComponent: (type: ComponentType) => void;
	selectedSectionId?: string | null;
	sections?: Section[];
}

const DraggableComponent: React.FC<{
	component: (typeof AVAILABLE_COMPONENTS)[0];
	onAdd: () => void;
	disabled?: boolean;
}> = ({ component, onAdd, disabled = false }) => {
	const [isDragging, setIsDragging] = useState(false);

	const getComponentIcon = (type: string) => {
		switch (type) {
			case "Button":
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
			case "Input":
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
			case "Card":
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
			case "Hero":
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
							d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
						/>
					</svg>
				);
		}
	};

	const handleDragStart = (e: React.DragEvent) => {
		setIsDragging(true);
		e.dataTransfer.effectAllowed = "copy";
		e.dataTransfer.setData("application/component-type", component.type);

		// Create a custom drag image
		const dragImage = document.createElement("div");
		dragImage.className =
			"bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-lg shadow-lg";
		dragImage.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <span class="font-medium">${component.name}</span>
      </div>
    `;
		dragImage.style.position = "absolute";
		dragImage.style.top = "-1000px";
		document.body.appendChild(dragImage);

		e.dataTransfer.setDragImage(dragImage, 0, 0);

		// Clean up drag image
		setTimeout(() => {
			document.body.removeChild(dragImage);
		}, 0);
	};

	const handleDragEnd = () => {
		setIsDragging(false);
	};

	return (
		<div
			draggable={!disabled}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			className={`
        group bg-slate-700 rounded-lg p-4 border-2 border-slate-600 transition-all duration-200
        ${
					disabled
						? "opacity-50 cursor-not-allowed"
						: "hover:border-indigo-500 cursor-move hover:bg-slate-600 hover:shadow-lg hover:shadow-blue-500/20"
				}
        ${isDragging ? "opacity-50 scale-95" : ""}
      `}
		>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="text-indigo-400 group-hover:text-indigo-300 transition-colors">
						{getComponentIcon(component.type)}
					</div>
					<div>
						<h3 className="font-medium text-white text-sm group-hover:text-blue-300 transition-colors">
							{component.name}
						</h3>
						<p className="text-xs text-slate-400 mt-1 group-hover:text-slate-300 transition-colors">
							{component.description}
						</p>
					</div>
				</div>
				<div className="flex gap-2 items-center">
					{/* Drag indicator */}
					{!disabled && (
						<div className="text-slate-400 group-hover:text-indigo-400 transition-colors">
							<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
								<path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
							</svg>
						</div>
					)}
					{/* Add button */}
					<button
						onClick={onAdd}
						disabled={disabled}
						className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs px-3 py-1.5 rounded-md font-medium transition-all hover:scale-105 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-1"
					>
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
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
							/>
						</svg>
						Add
					</button>
				</div>
			</div>
		</div>
	);
};

export const ComponentPalette: React.FC<ComponentPaletteProps> = ({
	onAddComponent,
	selectedSectionId,
	sections = [],
}) => {
	const selectedSection = sections.find((s) => s.id === selectedSectionId);

	return (
		<div className="w-80 h-full bg-slate-800 border-r border-slate-700 p-6 overflow-y-auto flex flex-col">
			<div className="mb-6">
				<h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
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
							d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
						/>
					</svg>
					Components
				</h2>
				{selectedSection ? (
					<div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-lg p-3 mb-4">
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
							<span className="text-sm text-indigo-300 flex items-center gap-1">
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
										d="M5 3l14 9-14 9V3z"
									/>
								</svg>
								Adding to:{" "}
								<span className="font-medium">{selectedSection.name}</span>
							</span>
						</div>
						<p className="text-xs text-indigo-400 mt-1 flex items-center gap-1">
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
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
							Click any component below to add it to this section
						</p>
					</div>
				) : sections.length > 0 ? (
					<div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-3 mb-4">
						<p className="text-sm text-yellow-300 flex items-center gap-2">
							<svg
								className="w-4 h-4"
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
							Select a section in the canvas to add components
						</p>
					</div>
				) : (
					<div className="bg-slate-700/50 border border-slate-600 rounded-lg p-3 mb-4">
						<p className="text-sm text-slate-400 flex items-center gap-2">
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
								/>
							</svg>
							Create a section first to start adding components
						</p>
					</div>
				)}
				<p className="text-sm text-slate-400 flex items-center gap-2">
					<svg
						className="w-4 h-4"
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
					Drag components to the canvas or click "Add" to place them.
				</p>
			</div>

			<div className="space-y-3 flex-1">
				{AVAILABLE_COMPONENTS.map((component) => (
					<DraggableComponent
						key={component.type}
						component={component}
						onAdd={() => onAddComponent(component.type)}
						disabled={!selectedSection}
					/>
				))}
			</div>
		</div>
	);
};
