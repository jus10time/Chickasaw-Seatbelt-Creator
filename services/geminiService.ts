import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  // logic handled by vite.config.ts define
  const apiKey = process.env.API_KEY; 
  
  if (!apiKey || apiKey.includes("PASTE_YOUR_")) {
    throw new Error("API Key is missing. If you are running locally, check your .env file. If you are deployed, check your Environment Variables configuration.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateDocumentStream = async (
  transcript: string,
  contextInfo: string,
  systemPrompt: string,
  userPrompt: string,
  onChunk: (text: string) => void
): Promise<void> => {
  const ai = getAiClient();
  
  // Construct the context block if provided
  const contextBlock = contextInfo.trim() 
    ? `\n<additional_context>\n${contextInfo.trim()}\n</additional_context>\n` 
    : '';

  // Replace placeholders or append content
  let fullContent = userPrompt;
  
  // Handle Transcript Injection
  if (fullContent.includes('{{TRANSCRIPT}}')) {
    fullContent = fullContent.replace('{{TRANSCRIPT}}', transcript);
  } else {
    // If user deleted the placeholder, append it intelligently
    fullContent = `Here is the raw video transcript content:

<transcript_content>
${transcript}
</transcript_content>

${fullContent}`;
  }

  // Handle Context Injection
  if (fullContent.includes('{{CONTEXT}}')) {
    fullContent = fullContent.replace('{{CONTEXT}}', contextBlock);
  } else {
    // Inject context near the transcript if placeholder is missing
    const transcriptEndIndex = fullContent.indexOf('</transcript_content>');
    if (transcriptEndIndex !== -1) {
      const insertPoint = transcriptEndIndex + 21; // length of tag
      fullContent = fullContent.slice(0, insertPoint) + "\n" + contextBlock + "\n" + fullContent.slice(insertPoint);
    } else {
      fullContent = contextBlock + "\n\n" + fullContent;
    }
  }

  try {
    // Using flash model for speed and cost effectiveness for text tasks
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview', 
      contents: fullContent,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json"
      }
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        onChunk(chunk.text);
      }
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate document. Check API Key and Quota.");
  }
};