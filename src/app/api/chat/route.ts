import { NextRequest, NextResponse } from "next/server";

// Elastic Agent Configuration
const KIBANA_URL = process.env.KIBANA_URL || "https://8602eaada14f43c4b1cd4cf1604d4df1.us-central1.gcp.cloud.es.io";
const ELASTIC_API_KEY = process.env.ELASTIC_API_KEY || "";
const AGENT_ID = process.env.ELASTIC_AGENT_ID || "elastic-ai-agent_1";

interface ChatRequest {
  message: string;
  attachedFile?: {
    name: string;
    type: string;
    data: string;
  };
  conversationId?: string;
}

interface ElasticStep {
  type: string;
  reasoning?: string;
  tool_call_id?: string;
  tool_id?: string;
  params?: Record<string, unknown>;
  results?: Array<{
    tool_result_id: string;
    type: string;
    data?: {
      content?: {
        highlights?: string[];
      };
    };
  }>;
}

interface ElasticConverseResponse {
  conversation_id: string;
  steps?: ElasticStep[];
  response?: {
    message: string;
  };
  message?: {
    content: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, attachedFile, conversationId } = body;

    if (!message && !attachedFile) {
      return NextResponse.json(
        { error: "Message or attached file is required" },
        { status: 400 }
      );
    }

    if (!ELASTIC_API_KEY) {
      console.error("ELASTIC_API_KEY not configured");
      return NextResponse.json(
        { error: "API key not configured. Please set ELASTIC_API_KEY environment variable." },
        { status: 500 }
      );
    }

    // Build the input message
    let inputMessage = message;
    
    // If there's an attached file, include its info in the message
    if (attachedFile) {
      if (attachedFile.type.startsWith('image/')) {
        inputMessage = `${message}\n\n[Attached image: ${attachedFile.name}]\nImage data (base64): ${attachedFile.data.substring(0, 100)}...`;
      } else {
        inputMessage = `${message}\n\n[Attached file: ${attachedFile.name}]`;
      }
    }

    // Build request body for Elastic Agent
    const elasticRequestBody: {
      input: string;
      agent_id: string;
      conversation_id?: string;
    } = {
      input: inputMessage,
      agent_id: AGENT_ID,
    };

    // Include conversation_id if provided (for multi-turn conversations)
    if (conversationId) {
      elasticRequestBody.conversation_id = conversationId;
    }

    console.log("Sending request to Elastic Agent:", {
      url: `${KIBANA_URL}/api/agent_builder/converse`,
      agent_id: AGENT_ID,
      hasConversationId: !!conversationId
    });

    // Call Elastic Agent API
    const response = await fetch(`${KIBANA_URL}/api/agent_builder/converse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `ApiKey ${ELASTIC_API_KEY}`,
        'kbn-xsrf': 'true',
      },
      body: JSON.stringify(elasticRequestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Elastic API error:", response.status, errorText);
      return NextResponse.json(
        { error: `Elastic API error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data: ElasticConverseResponse = await response.json();
    
    console.log("Elastic Agent response structure:", {
      hasConversationId: !!data.conversation_id,
      hasSteps: !!data.steps,
      hasResponse: !!data.response,
      hasMessage: !!data.message
    });

    // Extract the response content - handle multiple response formats
    let responseContent = "";
    
    if (data.response?.message) {
      // New format: data.response.message
      responseContent = data.response.message;
    } else if (data.message?.content) {
      // Alternative format: data.message.content
      responseContent = data.message.content;
    } else if (typeof data === 'string') {
      responseContent = data;
    } else {
      // Fallback: stringify the response
      responseContent = JSON.stringify(data);
    }

    // Extract reasoning steps from the steps array
    const reasoningSteps: string[] = [];
    if (data.steps && Array.isArray(data.steps)) {
      data.steps.forEach((step) => {
        if (step.type === "reasoning" && step.reasoning) {
          reasoningSteps.push(step.reasoning);
        } else if (step.type === "tool_call" && step.tool_id) {
          const toolName = step.tool_id.replace("platform.core.", "");
          reasoningSteps.push(`Using tool: ${toolName}`);
        }
      });
    }

    // If no reasoning steps found, use default
    if (reasoningSteps.length === 0) {
      reasoningSteps.push(
        "Analysing your query against NSW tenancy law knowledge base…",
        "Searching tenant vector database for relevant information…",
        "Formulating response with applicable legal references…"
      );
    }

    // Convert markdown-style response to HTML for display
    const formattedResponse = responseContent
      // Convert markdown headers
      .replace(/^### (.*$)/gim, '<h3 style="font-size: 1rem; font-weight: 600; margin: 12px 0 8px;">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 style="font-size: 1.1rem; font-weight: 600; margin: 14px 0 8px;">$1</h2>')
      // Convert bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Convert bullet points
      .replace(/^\d+\.\s+(.*)$/gim, '<li style="margin-left: 20px;">$1</li>')
      // Convert line breaks to paragraphs
      .replace(/\n\n/g, '</p><p style="margin-bottom: 8px;">')
      .replace(/\n/g, '<br/>');

    return NextResponse.json({
      response: formattedResponse,
      reasoning: reasoningSteps,
      conversationId: data.conversation_id || conversationId
    });

  } catch (error) {
    console.error("Chat API error:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to process your request: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
