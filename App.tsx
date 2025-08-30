import React, { useState, useMemo } from "react";
import { ComponentPalette } from "./components/ComponentPalette";
import { Canvas } from "./components/Canvas";
import { PropertiesPanel } from "./components/PropertiesPanel";
import { CodePreviewModal } from "./components/CodePreviewModal";
import { AiChat } from "./components/AiChat";
import {
	generateFrontendCode,
	generateBackendCode,
} from "./services/aiService";
import { Icon } from "./components/Icon";
import { ComponentType, CanvasComponent, Section } from "./types";
import { AVAILABLE_COMPONENTS } from "./constants";

type Tab = "frontend" | "backend" | "chat";

const App: React.FC = () => {
	const [activeTab, setActiveTab] = useState<Tab>("frontend");
	const [canvasComponents, setCanvasComponents] = useState<CanvasComponent[]>(
		[]
	);
	const [sections, setSections] = useState<Section[]>([]);
	const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
		null
	);
	const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
		null
	);
	const [isLoading, setIsLoading] = useState(false);
	const [isComponentPaletteCollapsed, setIsComponentPaletteCollapsed] =
		useState(false);
	const [isPropertiesPanelCollapsed, setIsPropertiesPanelCollapsed] =
		useState(false);

	const [generatedFrontendCode, setGeneratedFrontendCode] = useState("");
	const [isFrontendModalOpen, setIsFrontendModalOpen] = useState(false);

	const [backendDescription, setBackendDescription] = useState(
		"A user management system with fields for name, email, and password hash."
	);
	const [generatedBackendCode, setGeneratedBackendCode] = useState({
		apiCode: "",
		sqlCode: "",
	});
	const [isBackendModalOpen, setIsBackendModalOpen] = useState(false);

	const selectedComponent = useMemo(() => {
		return canvasComponents.find((c) => c.id === selectedComponentId) || null;
	}, [selectedComponentId, canvasComponents]);

	const addComponent = (
		type: ComponentType,
		position?: number,
		sectionId?: string
	) => {
		const componentDef = AVAILABLE_COMPONENTS.find((c) => c.type === type);
		if (!componentDef) return;

		// Use provided sectionId, or selectedSectionId, or first available section
		const targetSectionId = sectionId || selectedSectionId || sections[0]?.id;

		const newComponent: CanvasComponent = {
			id: `${type}-${Date.now()}`,
			type,
			props: componentDef.defaultProps,
			sectionId: targetSectionId,
		};

		if (position !== undefined) {
			setCanvasComponents((prev) => {
				const newComponents = [...prev];
				newComponents.splice(position, 0, newComponent);
				return newComponents;
			});
		} else {
			setCanvasComponents((prev) => [...prev, newComponent]);
		}
		setSelectedComponentId(newComponent.id);

		// Auto-expand Properties panel when component is added if it's collapsed
		if (isPropertiesPanelCollapsed) {
			setIsPropertiesPanelCollapsed(false);
		}
	};

	const addSection = () => {
		const newSection: Section = {
			id: `section-${Date.now()}`,
			name: `Section ${sections.length + 1}`,
			components: [],
		};
		setSections((prev) => [...prev, newSection]);
	};

	const updateSection = (id: string, updates: Partial<Section>) => {
		setSections((prev) =>
			prev.map((section) =>
				section.id === id ? { ...section, ...updates } : section
			)
		);
	};

	const updateComponent = (id: string, updates: Partial<CanvasComponent>) => {
		setCanvasComponents((prev) =>
			prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
		);
	};

	const deleteComponent = (id: string) => {
		setCanvasComponents((prev) => prev.filter((c) => c.id !== id));
		if (selectedComponentId === id) {
			setSelectedComponentId(null);
		}
	};

	const reorderComponents = (dragIndex: number, hoverIndex: number) => {
		setCanvasComponents((prev) => {
			const draggedItem = prev[dragIndex];
			const newComponents = [...prev];
			newComponents.splice(dragIndex, 1);
			newComponents.splice(hoverIndex, 0, draggedItem);
			return newComponents;
		});
	};

	const updateComponentProps = (id: string, newProps: any) => {
		setCanvasComponents((prev) =>
			prev.map((c) => (c.id === id ? { ...c, props: newProps } : c))
		);
	};

	const handleGenerateFrontend = async () => {
		setIsLoading(true);
		setGeneratedFrontendCode("");
		const code = await generateFrontendCode(canvasComponents);
		setGeneratedFrontendCode(code);
		setIsFrontendModalOpen(true);
		setIsLoading(false);
	};

	const handleGenerateBackend = async () => {
		if (!backendDescription.trim()) return;
		setIsLoading(true);
		setGeneratedBackendCode({ apiCode: "", sqlCode: "" });
		const codes = await generateBackendCode(backendDescription);
		setGeneratedBackendCode(codes);
		setIsBackendModalOpen(true);
		setIsLoading(false);
	};

	const TabButton: React.FC<{ tabName: Tab; icon: string; label: string }> = ({
		tabName,
		icon,
		label,
	}) => (
		<button
			onClick={() => setActiveTab(tabName)}
			className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
				activeTab === tabName
					? "bg-indigo-600 text-white"
					: "text-slate-300 hover:bg-slate-700"
			}`}
		>
			<Icon name={icon} className="w-5 h-5" />
			{label}
		</button>
	);

	return (
		<div className="h-screen w-screen flex flex-col font-sans">
			<header className="bg-slate-800 border-b border-slate-700 p-3 flex justify-between items-center z-10 shadow-md">
				<div className="flex items-center gap-2">
					<div className="p-2 bg-indigo-600 rounded-lg">
						<Icon name="code" className="w-6 h-6 text-white" />
					</div>
					<h1 className="text-xl font-bold text-white">
						AI Full-Stack Builder
					</h1>
				</div>
				<div className="flex items-center gap-2 bg-slate-700/50 p-1 rounded-lg">
					<TabButton tabName="frontend" icon="code" label="Frontend" />
					<TabButton tabName="backend" icon="server" label="Backend" />
					<TabButton tabName="chat" icon="chat" label="AI Assistant" />
				</div>
				<div>
					{activeTab === "frontend" && (
						<button
							onClick={handleGenerateFrontend}
							disabled={isLoading || canvasComponents.length === 0}
							className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-all disabled:bg-slate-600 disabled:cursor-not-allowed"
						>
							{isLoading ? (
								<Icon name="spinner" className="w-5 h-5 animate-spin" />
							) : (
								<Icon name="code" className="w-5 h-5" />
							)}
							Generate Code
						</button>
					)}
					{activeTab === "backend" && (
						<button
							onClick={handleGenerateBackend}
							disabled={isLoading || !backendDescription.trim()}
							className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-all disabled:bg-slate-600 disabled:cursor-not-allowed"
						>
							{isLoading ? (
								<Icon name="spinner" className="w-5 h-5 animate-spin" />
							) : (
								<Icon name="server" className="w-5 h-5" />
							)}
							Generate Backend
						</button>
					)}
				</div>
			</header>
			<main className="flex-1 flex overflow-hidden">
				{activeTab === "frontend" && (
					<>
						{/* Component Palette - Collapsible with Animation */}
						<div
							className={`transition-all duration-300 ease-in-out h-full ${
								isComponentPaletteCollapsed ? "w-0 overflow-hidden" : "w-80"
							}`}
						>
							<div className="relative h-full w-80">
								<ComponentPalette
									onAddComponent={addComponent}
									selectedSectionId={selectedSectionId}
									sections={sections}
								/>
								{/* Collapse Button for Component Palette */}
								<button
									onClick={() => setIsComponentPaletteCollapsed(true)}
									className="absolute top-4 right-2 p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors z-10"
									title="Collapse Components Panel"
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
											d="M15 19l-7-7 7-7"
										/>
									</svg>
								</button>
							</div>
						</div>

						{/* Expand Component Palette Button - when collapsed */}
						{isComponentPaletteCollapsed && (
							<button
								onClick={() => setIsComponentPaletteCollapsed(false)}
								className="fixed top-1/2 left-4 transform -translate-y-1/2 p-3 bg-slate-800/95 backdrop-blur-sm border border-slate-600 hover:bg-slate-700 text-slate-300 rounded-xl transition-all shadow-lg z-40"
								title="Expand Components Panel"
							>
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
							</button>
						)}

						{/* Canvas */}
						<div className="flex-1 relative">
							<Canvas
								components={canvasComponents}
								sections={sections}
								selectedComponentId={selectedComponentId}
								selectedSectionId={selectedSectionId}
								onSelectComponent={setSelectedComponentId}
								onSelectSection={setSelectedSectionId}
								onDeleteComponent={deleteComponent}
								onAddComponent={addComponent}
								onReorderComponents={reorderComponents}
								onUpdateComponent={updateComponent}
								onAddSection={addSection}
								onUpdateSection={updateSection}
							/>

							{/* Floating Component Bar - when collapsed */}
							{isComponentPaletteCollapsed && (
								<div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
									<div className="bg-slate-800/95 backdrop-blur-sm border border-slate-600 rounded-2xl px-6 py-4 shadow-2xl">
										<div className="flex items-center gap-4">
											{/* Status Indicator First */}
											{selectedSectionId ? (
												<div className="text-xs text-slate-400 flex items-center gap-2">
													<div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
													<span>
														Adding to:{" "}
														<span className="text-indigo-400 font-medium">
															{
																sections.find((s) => s.id === selectedSectionId)
																	?.name
															}
														</span>
													</span>
												</div>
											) : sections.length > 0 ? (
												<div className="text-xs text-yellow-400 flex items-center gap-2">
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
															d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
														/>
													</svg>
													Select a section first
												</div>
											) : (
												<div className="text-xs text-slate-500 flex items-center gap-2">
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
															d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
														/>
													</svg>
													Create a section first
												</div>
											)}

											{/* Divider */}
											{sections.length > 0 && (
												<div className="w-px h-6 bg-slate-600"></div>
											)}

											{/* Component Quick Access */}
											<div className="flex items-center gap-3">
												{AVAILABLE_COMPONENTS.map((component) => (
													<div
														key={component.type}
														draggable={!!selectedSectionId}
														onDragStart={(e) => {
															if (!selectedSectionId) {
																e.preventDefault();
																return;
															}
															e.dataTransfer.effectAllowed = "copy";
															e.dataTransfer.setData(
																"application/component-type",
																component.type
															);

															// Create a custom drag image
															const dragImage = document.createElement("div");
															dragImage.className =
																"bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-lg shadow-lg";
															dragImage.innerHTML = `
																<div class="flex items-center gap-2">
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
														}}
														className={`group relative ${
															selectedSectionId
																? "cursor-move"
																: "cursor-not-allowed"
														}`}
													>
														<button
															onClick={() => {
																if (selectedSectionId) {
																	addComponent(component.type);
																}
															}}
															disabled={!selectedSectionId}
															className="p-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-white rounded-xl transition-all hover:scale-105 disabled:hover:scale-100 group"
															title={
																selectedSectionId
																	? `Add ${component.name}`
																	: `Select a section first to add ${component.name}`
															}
														>
															{/* Component Icons */}
															{component.type === "Button" && (
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
															)}
															{component.type === "Input" && (
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
															)}
															{component.type === "Card" && (
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
															)}
															{component.type === "Hero" && (
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
															)}
															{component.type === "Section" && (
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
															)}
															{component.type === "Heading" && (
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
																		d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707L16.414 6.3a1 1 0 00-.707-.293L7 6a2 2 0 00-2 2v11a2 2 0 002 2z"
																	/>
																</svg>
															)}
														</button>

														{/* Drag indicator for draggable items */}
														{selectedSectionId && (
															<div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
																<svg
																	className="w-2 h-2 text-white"
																	fill="currentColor"
																	viewBox="0 0 20 20"
																>
																	<path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
																</svg>
															</div>
														)}
													</div>
												))}
											</div>

											{/* Expand button */}
											<div className="w-px h-6 bg-slate-600"></div>
											<button
												onClick={() => setIsComponentPaletteCollapsed(false)}
												className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-all"
												title="Expand Components Panel"
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
														d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
													/>
												</svg>
											</button>
										</div>
									</div>
								</div>
							)}
						</div>

						{/* Properties Panel - Collapsible with Animation */}
						<div
							className={`transition-all duration-300 ease-in-out h-full ${
								isPropertiesPanelCollapsed ? "w-0 overflow-hidden" : "w-80"
							}`}
						>
							<div className="relative h-full w-80">
								<PropertiesPanel
									selectedComponent={selectedComponent}
									sections={sections}
									onUpdateProps={updateComponentProps}
								/>
								{/* Collapse Button for Properties Panel */}
								<button
									onClick={() => setIsPropertiesPanelCollapsed(true)}
									className="absolute top-4 left-2 p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors z-10"
									title="Collapse Properties Panel"
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
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</button>
							</div>
						</div>

						{/* Expand Properties Panel Button - when collapsed */}
						{isPropertiesPanelCollapsed && (
							<button
								onClick={() => setIsPropertiesPanelCollapsed(false)}
								className="fixed top-1/2 right-4 transform -translate-y-1/2 p-3 bg-slate-800/95 backdrop-blur-sm border border-slate-600 hover:bg-slate-700 text-slate-300 rounded-xl transition-all shadow-lg z-40"
								title="Expand Properties Panel"
							>
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
							</button>
						)}
					</>
				)}
				{activeTab === "backend" && (
					<div className="flex-1 p-8 bg-slate-900 flex justify-center items-start">
						<div className="w-full max-w-2xl space-y-6">
							<h2 className="text-3xl font-bold text-white">
								Describe Your Backend Logic
							</h2>
							<p className="text-slate-400">
								Describe the data model or API endpoint you need in plain
								English. The AI will generate the necessary code for you.
							</p>
							<textarea
								value={backendDescription}
								onChange={(e) => setBackendDescription(e.target.value)}
								rows={8}
								className="w-full bg-slate-800 border border-slate-700 rounded-lg p-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
								placeholder="e.g., A blog post with a title, content, author, and publication date."
							/>
						</div>
					</div>
				)}
				{activeTab === "chat" && <AiChat />}
			</main>

			<CodePreviewModal
				title="Generated Frontend Code (TSX)"
				code={generatedFrontendCode}
				isOpen={isFrontendModalOpen}
				onClose={() => setIsFrontendModalOpen(false)}
				language="tsx"
			/>

			<CodePreviewModal
				title="Generated Backend Code (Node.js/Express + SQL)"
				code={`// API Route (api.js)\n${generatedBackendCode.apiCode}\n\n-- Database Schema (schema.sql)\n${generatedBackendCode.sqlCode}`}
				isOpen={isBackendModalOpen}
				onClose={() => setIsBackendModalOpen(false)}
				language="javascript"
			/>
		</div>
	);
};

export default App;
