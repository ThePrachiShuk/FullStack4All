import React, { useState, useRef } from "react";
import { CanvasComponent, ComponentType, Section } from "../types";
import { Icon } from "./Icon";

interface CanvasProps {
	components: CanvasComponent[];
	sections: Section[];
	selectedComponentId: string | null;
	selectedSectionId: string | null;
	onSelectComponent: (id: string) => void;
	onSelectSection: (id: string) => void;
	onDeleteComponent: (id: string) => void;
	onAddComponent: (
		type: ComponentType,
		position?: number,
		sectionId?: string
	) => void;
	onReorderComponents: (dragIndex: number, hoverIndex: number) => void;
	onUpdateComponent?: (id: string, updates: Partial<CanvasComponent>) => void;
	onAddSection: () => void;
}

const ResizeHandle: React.FC<{
	onResize: (direction: string, deltaX: number, deltaY: number) => void;
	position: string;
}> = ({ onResize, position }) => {
	const [isDragging, setIsDragging] = useState(false);

	const handleMouseDown = (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();

		setIsDragging(true);
		const startX = e.clientX;
		const startY = e.clientY;

		const handleMouseMove = (e: MouseEvent) => {
			e.preventDefault();
			const deltaX = e.clientX - startX;
			const deltaY = e.clientY - startY;
			onResize(position, deltaX, deltaY);
		};

		const handleMouseUp = () => {
			setIsDragging(false);
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	const getPositionClasses = () => {
		const base =
			"absolute w-3 h-3 bg-indigo-500 border border-white rounded-sm hover:bg-indigo-400 transition-colors z-50";
		switch (position) {
			case "nw":
				return `${base} cursor-nw-resize -top-1 -left-1`;
			case "ne":
				return `${base} cursor-ne-resize -top-1 -right-1`;
			case "sw":
				return `${base} cursor-sw-resize -bottom-1 -left-1`;
			case "se":
				return `${base} cursor-se-resize -bottom-1 -right-1`;
			case "n":
				return `${base} cursor-n-resize -top-1 left-1/2 transform -translate-x-1/2`;
			case "s":
				return `${base} cursor-s-resize -bottom-1 left-1/2 transform -translate-x-1/2`;
			case "w":
				return `${base} cursor-w-resize top-1/2 -left-1 transform -translate-y-1/2`;
			case "e":
				return `${base} cursor-e-resize top-1/2 -right-1 transform -translate-y-1/2`;
			default:
				return base;
		}
	};

	return <div className={getPositionClasses()} onMouseDown={handleMouseDown} />;
};

const RenderedComponent: React.FC<{
	component: CanvasComponent;
	isSelected: boolean;
	onSelect: () => void;
	onDelete: () => void;
	onUpdateComponent?: (id: string, updates: Partial<CanvasComponent>) => void;
}> = ({ component, isSelected, onSelect, onDelete, onUpdateComponent }) => {
	const { type, props, size, position } = component;
	const [isDragging, setIsDragging] = useState(false);

	const handleComponentResize = (
		direction: string,
		deltaX: number,
		deltaY: number
	) => {
		if (!onUpdateComponent) return;

		const initialWidth = parseInt(size?.width?.replace("px", "") || "300");
		const initialHeight = parseInt(size?.height?.replace("px", "") || "100");

		let newWidth = initialWidth;
		let newHeight = initialHeight;

		// Handle horizontal resizing
		if (direction.includes("e")) {
			newWidth = initialWidth + deltaX;
		}
		if (direction.includes("w")) {
			newWidth = initialWidth - deltaX;
		}

		// Handle vertical resizing
		if (direction.includes("s")) {
			newHeight = initialHeight + deltaY;
		}
		if (direction.includes("n")) {
			newHeight = initialHeight - deltaY;
		}

		// Minimum size constraints
		newWidth = Math.max(100, newWidth);
		newHeight = Math.max(50, newHeight);

		onUpdateComponent(component.id, {
			size: {
				width: `${newWidth}px`,
				height: `${newHeight}px`,
			},
		});
	};

	const handleDragStart = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (!onUpdateComponent) return;

		setIsDragging(true);
		const startX = e.clientX;
		const startY = e.clientY;
		const initialX = position?.x || 0;
		const initialY = position?.y || 0;

		const handleMouseMove = (e: MouseEvent) => {
			const deltaX = e.clientX - startX;
			const deltaY = e.clientY - startY;

			onUpdateComponent(component.id, {
				position: {
					x: initialX + deltaX,
					y: initialY + deltaY,
				},
			});
		};

		const handleMouseUp = () => {
			setIsDragging(false);
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	const handleSelect = (e: React.MouseEvent) => {
		e.stopPropagation();
		onSelect();
	};

	const renderComponent = () => {
		const baseStyle: React.CSSProperties = {
			width: size?.width || "auto",
			height: size?.height || "auto",
		};

		switch (type) {
			case ComponentType.Hero:
				return (
					<div
						className="text-center p-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-xl"
						style={baseStyle}
					>
						<svg
							className="w-16 h-16 mx-auto mb-4 text-indigo-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
							/>
						</svg>
						<h1 className="text-5xl font-bold text-white mb-4">
							{props.title}
						</h1>
						<p className="text-xl text-slate-300 mb-8">{props.subtitle}</p>
						<button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg">
							{props.ctaText}
						</button>
					</div>
				);
			case ComponentType.Heading:
				const Tag = `h${props.level}` as React.ElementType;
				return (
					<Tag className="font-bold text-white tracking-tight">
						{props.text}
					</Tag>
				);
			case ComponentType.Button:
				const variantClasses = {
					primary: "bg-indigo-600 hover:bg-indigo-500 text-white",
					secondary: "bg-slate-600 hover:bg-slate-500 text-white",
					outline:
						"bg-transparent border border-indigo-500 text-indigo-400 hover:bg-indigo-500 hover:text-white",
				};
				return (
					<button
						className={`px-5 py-2.5 font-medium rounded-lg text-sm transition-all ${
							variantClasses[props.variant || "primary"]
						}`}
					>
						{props.text}
					</button>
				);
			case ComponentType.Input:
				return (
					<input
						type={props.type}
						placeholder={props.placeholder}
						className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:ring-indigo-500 focus:border-indigo-500"
					/>
				);
			case ComponentType.Card:
				return (
					<div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
						<img
							src={props.imageUrl}
							alt={props.title}
							className="w-full h-40 object-cover"
						/>
						<div className="p-6">
							<h3 className="text-xl font-bold text-white mb-2">
								{props.title}
							</h3>
							<p className="text-slate-400">{props.description}</p>
						</div>
					</div>
				);
			default:
				return (
					<div className="p-4 border border-dashed border-red-500">
						Unknown Component
					</div>
				);
		}
	};

	return (
		<div
			onClick={handleSelect}
			className={`
				relative transition-all duration-200 group select-none
				${isDragging ? "z-50 opacity-75" : ""}
				${
					isSelected
						? "ring-2 ring-indigo-500 bg-slate-800/30"
						: "hover:bg-slate-800/20"
				}
			`}
			style={{
				position: position ? "absolute" : "relative",
				left: position?.x ? `${position.x}px` : "auto",
				top: position?.y ? `${position.y}px` : "auto",
				zIndex: isSelected ? 10 : 1,
				padding: "8px",
				borderRadius: "8px",
				minWidth: "100px",
				minHeight: "50px",
			}}
		>
			{/* Drag Handle */}
			{isSelected && (
				<div className="absolute -left-3 top-1/2 transform -translate-y-1/2 z-20">
					<div
						className="drag-handle bg-slate-600 text-white p-1 rounded cursor-grab hover:bg-slate-500 transition-colors active:cursor-grabbing"
						onMouseDown={(e) => {
							e.stopPropagation();
							handleDragStart(e);
						}}
						title="Drag to move component"
					>
						<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
							<path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
						</svg>
					</div>
				</div>
			)}

			{renderComponent()}

			{/* Resize Handles */}
			{isSelected && onUpdateComponent && (
				<>
					<ResizeHandle onResize={handleComponentResize} position="nw" />
					<ResizeHandle onResize={handleComponentResize} position="ne" />
					<ResizeHandle onResize={handleComponentResize} position="sw" />
					<ResizeHandle onResize={handleComponentResize} position="se" />
					<ResizeHandle onResize={handleComponentResize} position="n" />
					<ResizeHandle onResize={handleComponentResize} position="s" />
					<ResizeHandle onResize={handleComponentResize} position="w" />
					<ResizeHandle onResize={handleComponentResize} position="e" />
				</>
			)}

			{/* Delete Button */}
			{isSelected && (
				<button
					onClick={(e) => {
						e.stopPropagation();
						onDelete();
					}}
					className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-500 z-10"
					aria-label="Delete component"
				>
					<svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
						<path
							fillRule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clipRule="evenodd"
						/>
					</svg>
				</button>
			)}
		</div>
	);
};

export const Canvas: React.FC<CanvasProps> = ({
	components,
	sections = [],
	selectedComponentId,
	selectedSectionId,
	onSelectComponent,
	onSelectSection,
	onDeleteComponent,
	onAddComponent,
	onUpdateComponent,
	onAddSection,
}) => {
	const [isDraggingNewComponent, setIsDraggingNewComponent] =
		useState<ComponentType | null>(null);
	const draggedComponentType = useRef<ComponentType | null>(null);

	// Handle drop from component palette
	const handleCanvasDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		const componentType = e.dataTransfer.getData(
			"application/component-type"
		) as ComponentType;
		if (componentType) {
			setIsDraggingNewComponent(componentType);
			draggedComponentType.current = componentType;
		}
	};

	const handleCanvasDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation(); // Prevent event bubbling to avoid duplicates
		setIsDraggingNewComponent(null);
		draggedComponentType.current = null;
		// Don't add component here - let sections handle it
	};

	return (
		<div
			className="flex-1 p-8 bg-slate-900 overflow-y-auto"
			onDragOver={handleCanvasDragOver}
			onDrop={handleCanvasDrop}
		>
			<div className="max-w-4xl mx-auto bg-dots rounded-lg p-6 min-h-[600px]">
				{/* Header with Add Section button */}
				<div className="mb-6 flex justify-between items-center">
					<h2 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
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
								d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a4 4 0 004-4V5z"
							/>
						</svg>
						Canvas
					</h2>
					<button
						onClick={onAddSection}
						className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg flex items-center gap-2"
					>
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
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
							/>
						</svg>
						Add Section
					</button>
				</div>

				{/* Show section-based layout */}
				{sections.length === 0 ? (
					<div
						className={`
							flex items-center justify-center h-96 border-2 border-dashed rounded-lg transition-all
							${
								isDraggingNewComponent
									? "border-indigo-400 bg-indigo-500/10"
									: "border-slate-700"
							}
						`}
					>
						<div className="text-center">
							<svg
								className="w-16 h-16 mx-auto mb-4 text-slate-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
								/>
							</svg>
							<p className="text-slate-500 text-lg mb-4 font-medium">
								{isDraggingNewComponent ? (
									<span className="flex items-center gap-2 justify-center">
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
												d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
											/>
										</svg>
										Drop your component here!
									</span>
								) : (
									<span className="flex items-center gap-2 justify-center">
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
												d="M13 10V3L4 14h7v7l9-11h-7z"
											/>
										</svg>
										Let's start building!
									</span>
								)}
							</p>
							<p className="text-slate-600 text-sm mb-6">
								Create your first section to organize your components
							</p>
							<button
								onClick={onAddSection}
								className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg flex items-center gap-2 mx-auto"
							>
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
										d="M12 6v6m0 0v6m0-6h6m-6 0H6"
									/>
								</svg>
								Create First Section
							</button>
						</div>
					</div>
				) : (
					/* Show sections with components */
					<div className="space-y-6">
						{sections.map((section) => (
							<div
								key={section.id}
								onClick={() => onSelectSection(section.id)}
								className={`relative w-full rounded-lg border-2 transition-all duration-200 mb-6 cursor-pointer ${
									selectedSectionId === section.id
										? "border-indigo-500 bg-indigo-500/10"
										: "border-slate-600 hover:border-slate-500"
								}`}
								style={{
									backgroundColor: section.backgroundColor || "#1e293b",
									padding: section.padding || "2rem 1rem",
									minHeight: section.minHeight || "200px",
								}}
								onDragOver={(e) => {
									e.preventDefault();
									e.dataTransfer.dropEffect = "copy";
								}}
								onDrop={(e) => {
									e.preventDefault();
									e.stopPropagation(); // Prevent bubbling to parent Canvas
									const componentType = e.dataTransfer.getData(
										"application/component-type"
									) as ComponentType;
									if (componentType) {
										onAddComponent(componentType, undefined, section.id);
									}
									setIsDraggingNewComponent(null);
									draggedComponentType.current = null;
								}}
							>
								{/* Section Header */}
								<div
									className={`absolute -top-6 left-4 px-3 py-1 rounded-t-lg shadow-lg ${
										selectedSectionId === section.id
											? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
											: "bg-slate-700"
									}`}
								>
									<span
										className={`text-sm font-medium flex items-center gap-2 ${
											selectedSectionId === section.id
												? "text-white"
												: "text-slate-300"
										}`}
									>
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
												d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
											/>
										</svg>
										{section.name}
									</span>
									{selectedSectionId === section.id && (
										<span className="text-xs opacity-75 flex items-center gap-1">
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
											Active Section
										</span>
									)}
								</div>

								{/* Section Content */}
								<div className="relative min-h-full">
									{components.filter((comp) => comp.sectionId === section.id)
										.length === 0 ? (
										<div className="flex items-center justify-center h-32 rounded-lg border-2 border-dashed border-slate-600 bg-slate-800/30">
											<div className="text-center">
												<div className="text-4xl mb-2">🎯</div>
												<p className="text-slate-500 font-medium">
													Drop components here!
												</p>
												<p className="text-slate-600 text-sm mt-1">
													Drag from the left panel or click "Add" button
												</p>
											</div>
										</div>
									) : (
										<div className="space-y-4">
											{components
												.filter((comp) => comp.sectionId === section.id)
												.map((comp) => (
													<RenderedComponent
														key={comp.id}
														component={comp}
														isSelected={selectedComponentId === comp.id}
														onSelect={() => onSelectComponent(comp.id)}
														onDelete={() => onDeleteComponent(comp.id)}
														onUpdateComponent={onUpdateComponent}
													/>
												))}
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};
