import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment variables.");
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
    // If no placeholder, insert it right after the transcript block (conceptually)
    // or simply append it before the logic checks if possible. 
    // To be safe and effective, we add it right after the transcript content in our constructed string
    // OR if we already did string replacement, we just prepend it to the Logic Check section if we can find it, 
    // otherwise just append it to the top or bottom. 
    // Simplest robust approach: Append it to the transcript section.
    
    // If we just did the fallback append above:
    if (!userPrompt.includes('{{TRANSCRIPT}}')) {
       // It's already in the string we constructed above
       const insertPoint = fullContent.indexOf('</transcript_content>') + 21;
       fullContent = fullContent.slice(0, insertPoint) + contextBlock + fullContent.slice(insertPoint);
    } else {
       // If the user used {{TRANSCRIPT}}, we assume they might not have used {{CONTEXT}}.
       // We'll append context after the transcript replacement.
       // This is a heuristic; technically it's safer to just add it at the very top or bottom, 
       // but context is usually best near the source material.
       fullContent = contextBlock + "\n" + fullContent;
    }
  }

  try {
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
    throw new Error(error.message || "Failed to generate document");
  }
};
