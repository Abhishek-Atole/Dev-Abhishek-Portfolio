
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Portfolio context about Abhishek Atole
const PORTFOLIO_CONTEXT = `
You are Abhishek Atole's AI assistant. You help visitors learn about Abhishek's professional background, skills, and projects.

About Abhishek Atole:
- C++ and Java Developer specializing in high-performance systems and backend development
- Expertise in virtual systems, deep logic implementation, and clean architecture
- Focus areas: Systems programming, algorithm optimization, virtual machines, and backend solutions
- Educational background in Computer Science with emphasis on low-level programming
- Professional experience includes developing complex C++ applications and Java backend systems
- Passionate about clean code, performance optimization, and elegant software design

Technical Skills:
- Languages: C++, Java, Python, JavaScript/TypeScript
- Systems: Linux, Windows, Virtual Machine development
- Backend: Database design, API development, microservices
- Tools: Git, Docker, various development environments
- Specialties: Memory management, algorithm optimization, system-level programming

You should be helpful, professional, and knowledgeable about software development. When asked about specific projects or blog posts, encourage visitors to explore the portfolio website. For recruiting questions, highlight Abhishek's technical expertise and problem-solving abilities.

Keep responses concise but informative. Suggest relevant follow-up questions when appropriate.
`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { message, context } = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: PORTFOLIO_CONTEXT
          },
          { 
            role: 'user', 
            content: message 
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Generate contextual suggestions based on the conversation
    const suggestions = generateSuggestions(message, aiResponse);

    return new Response(JSON.stringify({ 
      response: aiResponse,
      suggestions 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chatbot function:', error);
    return new Response(JSON.stringify({ 
      response: "I'm sorry, I'm experiencing some technical difficulties. Please try asking your question again.",
      suggestions: [
        "Tell me about Abhishek's technical skills",
        "What programming languages does he use?",
        "Show me his latest projects"
      ]
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateSuggestions(userMessage: string, aiResponse: string): string[] {
  const messageLower = userMessage.toLowerCase();
  
  if (messageLower.includes('project')) {
    return [
      "What technologies did he use in these projects?",
      "Tell me about his C++ applications",
      "Show me his GitHub repositories"
    ];
  }
  
  if (messageLower.includes('skill') || messageLower.includes('experience')) {
    return [
      "What's his experience with Java?",
      "Tell me about his systems programming work",
      "What backend technologies does he use?"
    ];
  }
  
  if (messageLower.includes('blog') || messageLower.includes('article')) {
    return [
      "What topics does he write about?",
      "Show me his latest blog posts",
      "Tell me about his technical writing"
    ];
  }
  
  if (messageLower.includes('education') || messageLower.includes('background')) {
    return [
      "What's his professional experience?",
      "Tell me about his certifications",
      "What companies has he worked for?"
    ];
  }
  
  // Default suggestions
  return [
    "Tell me about his C++ expertise",
    "What are his notable projects?",
    "How can I contact him for opportunities?"
  ];
}
