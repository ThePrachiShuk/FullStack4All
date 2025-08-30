import OpenAI from "openai";
import { CanvasComponent } from "../types";

if (!import.meta.env.VITE_API_KEY) {
	throw new Error("API_KEY environment variable is not set");
}

const openai = new OpenAI({
	apiKey: import.meta.env.VITE_API_KEY,
	baseURL: "https://openrouter.ai/api/v1",
	dangerouslyAllowBrowser: true,
});

const systemInstruction = `You are an expert AI assistant for a no-code website builder.
Your role is to help non-technical users understand code, get ideas, and make edits.
Be concise, helpful, and encouraging. Use simple language.
When asked to modify code, provide the complete, updated code block.
When asked for ideas, provide actionable suggestions.`;

export async function generateFrontendCode(
	components: CanvasComponent[]
): Promise<string> {
	const componentDescriptions = components
		.map((c) => {
			const propsString = Object.entries(c.props)
				.map(([key, value]) => `${key}="${value}"`)
				.join(" ");
			return `<${c.type} ${propsString} />`;
		})
		.join("\n");

	const prompt = `
        Generate a single React functional component named 'MyPage' using TypeScript and Tailwind CSS.
        The component should render the following elements based on the descriptions provided.
        The layout should be a single column with vertical spacing between elements.
        The entire component should be wrapped in a main container with a dark background (e.g., bg-slate-900) and padding.
        
        Component descriptions:
        ${componentDescriptions}

        Rules:
        - Use functional components and hooks.
        - Use Tailwind CSS for all styling. Do not use inline styles or CSS files.
        - Generate realistic and visually appealing styles for each component.
        - Ensure the generated TSX is clean, well-formatted, and complete.
        - Do not include 'import React from "react";' or any other imports. Just return the component code itself.
        - Make the component self-contained.
    `;

	try {
		const response = await openai.chat.completions.create({
			model: "deepseek/deepseek-r1",
			messages: [{ role: "user", content: prompt }],
		});

		const text = response.choices[0]?.message?.content || "";
		// Often, the code is wrapped in ```tsx ... ```, so we extract it.
		const codeBlockMatch = text.match(
			/```(?:tsx|jsx|typescript)?\s*([\s\S]*?)\s*```/
		);
		return codeBlockMatch ? codeBlockMatch[1].trim() : text.trim();
	} catch (error) {
		console.error("Error generating frontend code:", error);
		return `// Error generating code: ${
			error instanceof Error ? error.message : "Unknown error"
		}`;
	}
}

export async function generateBackendCode(
	description: string
): Promise<{ apiCode: string; sqlCode: string }> {
	const prompt = `Based on the following description, generate a Node.js/Express API POST route and a corresponding SQL CREATE TABLE statement.
    Description: "${description}"
    
    Please respond with a JSON object that has exactly this structure:
    {
        "apiCode": "The Node.js and Express code for a POST API route. Use comments to explain the code.",
        "sqlCode": "The SQL 'CREATE TABLE' statement for the database schema."
    }`;

	try {
		const response = await openai.chat.completions.create({
			model: "deepseek/deepseek-r1",
			messages: [{ role: "user", content: prompt }],
		});

		const text = response.choices[0]?.message?.content || "";

		// Try to parse as JSON
		try {
			return JSON.parse(text);
		} catch {
			// If parsing fails, try to extract JSON from the response
			const jsonMatch = text.match(/\{[\s\S]*\}/);
			if (jsonMatch) {
				return JSON.parse(jsonMatch[0]);
			}

			// Fallback: create a structured response
			return {
				apiCode: `// Generated API code:\n${text}`,
				sqlCode: `-- Generated SQL code:\n-- Please extract from the response above`,
			};
		}
	} catch (error) {
		console.error("Error generating backend code:", error);
		return {
			apiCode: `// Error generating API code: ${
				error instanceof Error ? error.message : "Unknown error"
			}`,
			sqlCode: `-- Error generating SQL code: ${
				error instanceof Error ? error.message : "Unknown error"
			}`,
		};
	}
}

export async function streamChatResponse(
	message: string,
	onChunk: (chunk: string) => void
) {
	try {
		const stream = await openai.chat.completions.create({
			model: "deepseek/deepseek-r1",
			messages: [
				{ role: "system", content: systemInstruction },
				{ role: "user", content: message },
			],
			stream: true,
		});

		for await (const chunk of stream) {
			const content = chunk.choices[0]?.delta?.content || "";
			if (content) {
				onChunk(content);
			}
		}
	} catch (error) {
		console.error("Error in chat stream:", error);
		onChunk(
			`An error occurred: ${
				error instanceof Error ? error.message : "Unknown error"
			}`
		);
	}
}
