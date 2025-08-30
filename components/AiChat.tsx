import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { streamChatResponse } from "../services/aiService";
import { Icon } from "./Icon";

export const AiChat: React.FC = () => {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(scrollToBottom, [messages]);

	const handleSend = async () => {
		if (!input.trim() || isLoading) return;
		const newMessages: ChatMessage[] = [
			...messages,
			{ role: "user", text: input },
		];
		setMessages(newMessages);
		setInput("");
		setIsLoading(true);

		let fullResponse = "";
		setMessages((prev) => [...prev, { role: "model", text: "" }]);

		await streamChatResponse(input, (chunk) => {
			fullResponse += chunk;
			setMessages((prev) => {
				const lastMsgIndex = prev.length - 1;
				const updatedMessages = [...prev];
				if (
					updatedMessages[lastMsgIndex] &&
					updatedMessages[lastMsgIndex].role === "model"
				) {
					updatedMessages[lastMsgIndex] = { role: "model", text: fullResponse };
				}
				return updatedMessages;
			});
		});

		setIsLoading(false);
	};

	return (
		<div className="flex-1 flex flex-col bg-slate-900">
			<div className="flex-1 p-6 overflow-y-auto">
				<div className="max-w-3xl mx-auto space-y-6">
					{messages.length === 0 && (
						<div className="text-center text-slate-500">
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
									d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
								/>
							</svg>
							<h2 className="text-2xl font-bold text-slate-300 mb-2 flex items-center justify-center gap-2">
								<svg
									className="w-6 h-6"
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
								AI Assistant
							</h2>
							<p className="text-lg text-slate-400 mb-3 flex items-center justify-center gap-2">
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
										d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
									/>
								</svg>
								Ask me anything about your project!
							</p>
							<div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-lg p-4 max-w-md mx-auto">
								<p className="text-sm text-indigo-300 mb-2 font-medium flex items-center gap-2">
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
											d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
										/>
									</svg>
									Try asking:
								</p>
								<ul className="text-sm text-slate-300 space-y-1">
									<li>• "Give me ideas for a pricing page"</li>
									<li>• "How do I improve this design?"</li>
									<li>• "Explain this code to me"</li>
								</ul>
							</div>
						</div>
					)}
					{messages.map((msg, index) => (
						<div
							key={index}
							className={`flex gap-3 ${
								msg.role === "user" ? "justify-end" : "justify-start"
							}`}
						>
							{msg.role === "model" && (
								<div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white">
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
											d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
										/>
									</svg>
								</div>
							)}
							<div
								className={`max-w-lg p-3 rounded-2xl ${
									msg.role === "user"
										? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none"
										: "bg-slate-700 text-slate-200 rounded-bl-none"
								}`}
							>
								<p className="whitespace-pre-wrap">{msg.text}</p>
								{msg.role === "model" &&
									isLoading &&
									index === messages.length - 1 && (
										<span className="inline-block w-2 h-4 bg-white ml-1 animate-pulse rounded-full" />
									)}
							</div>
							{msg.role === "user" && (
								<div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white">
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
											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
										/>
									</svg>
								</div>
							)}
						</div>
					))}
					<div ref={messagesEndRef} />
				</div>
			</div>
			<div className="p-4 border-t border-slate-700 bg-slate-800">
				<div className="max-w-3xl mx-auto flex items-center gap-3">
					<input
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyPress={(e) => e.key === "Enter" && handleSend()}
						placeholder="Ask the AI assistant anything..."
						className="flex-1 bg-slate-700 border-slate-600 rounded-full px-5 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
						disabled={isLoading}
					/>
					<button
						onClick={handleSend}
						disabled={isLoading || !input.trim()}
						className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full p-3 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed hover:from-indigo-500 hover:to-purple-500 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:scale-105 disabled:hover:scale-100"
						title={isLoading ? "Thinking..." : "Send message"}
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
								d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
};
