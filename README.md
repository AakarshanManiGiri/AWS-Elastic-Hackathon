guardAIn - NSW Tenant Assistant
Runner-Up - Elastic/AWS Forge the Future Hackathon

Next.jsTypeScriptElasticsearchAWSTailwind CSS

Overview
guardAIn is an AI-powered tenancy information assistant designed to help New South Wales tenants understand their rights and navigate rental disputes. Built during the Elastic/AWS Forge the Future Hackathon, this application leverages Elasticsearch's Agent Builder with RAG (Retrieval-Augmented Generation) capabilities to provide accurate, contextual legal information to tenants.

The application aims to bridge the gap in accessible tenancy information, offering instant guidance on common rental issues such as rent increases, repair requests, bond disputes, and lease reviews. It maintains clear disclaimers about the informational nature of the service and directs users to qualified legal professionals and NSW Fair Trading for official guidance.

Hackathon Achievement
This project was recognized as a Runner-Up in the Forge the Future Hackathon, an event sponsored by Elastic and AWS. The challenge focused on leveraging AI and data to solve real-world problems across sectors like public service, finance, and healthcare.

Features
Intelligent Tenancy Assistance
Lease Review Analysis - Upload and analyze lease documents for potential issues.
Repair Request Guidance - Step-by-step guidance for urgent repair requests.
Rent Increase Validation - Check if rent increases comply with NSW regulations.
Bond Dispute Resolution - Navigate bond return disputes with documented processes.
Official Document References - Links to NSW Fair Trading resources and forms.
AI-Powered Reasoning
Multi-Step Analysis - Visual breakdown of the AI reasoning process.
Transparent Processing - See how the system analyzes each query.
Contextual Responses - Conversations maintain context across multiple exchanges.
Source Attribution - Responses reference applicable NSW tenancy legislation.
Document Support
File Attachments - Upload images, PDFs, and documents for analysis.
Multi-Format Support - Accepts images, PDFs, Word documents, and text files.
Contextual Integration - Attached files are analyzed alongside user queries.
Conversation Management
Multi-Turn Dialogues - Maintain conversation context for complex queries.
Recent Cases Sidebar - Quick access to previous conversations.
New Chat Functionality - Start fresh conversations with a single click.
Architecture
┌─────────────────────────────────────────────────────────────────┐
│ Frontend (Next.js) │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│ │ React UI │ │ Tailwind │ │ shadcn/ui Components │ │
│ │ (TypeScript)│ │ CSS │ │ │ │
│ └─────────────┘ └─────────────┘ └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────┐
│ Backend API (Next.js Routes) │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ /api/chat Endpoint ││
│ │ • Request validation ││
│ │ • Conversation management ││
│ │ • Response formatting ││
│ └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────┐
│ Elasticsearch Agent Builder (RAG) │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│ │ Vector │ │ NSW │ │ AI Reasoning │ │
│ │ Search │ │ Tenancy │ │ Engine │ │
│ │ │ │ Knowledge │ │ │ │
│ └─────────────┘ └─────────────┘ └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────┐
│ Database (Prisma + SQLite) │
│ ┌─────────────┐ ┌─────────────┐ │
│ │ Users │ │ Posts │ │
│ └─────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘

text


---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Tailwind CSS 4** | Utility-first styling |
| **shadcn/ui** | Accessible UI components |
| **Radix UI** | Headless component primitives |
| **Framer Motion** | Animation library |
| **React Hook Form** | Form state management |
| **Zod** | Schema validation |

### Backend
| Technology | Purpose |
|------------|---------|
| **Next.js API Routes** | Serverless API endpoints |
| **Prisma** | Database ORM |
| **SQLite** | Development database |
| **z-ai-web-dev-sdk** | AI integration SDK |

### AI & Infrastructure
| Technology | Purpose |
|------------|---------|
| **Elasticsearch Agent Builder** | RAG-powered AI assistant |
| **Elastic Cloud** | Managed Elasticsearch hosting |
| **AWS** | Cloud infrastructure |
| **Caddy** | Reverse proxy server |

---

## Project Structure

AWS-Elastic-Hackathon/
├── Pitch Deck/
│ └── guardAIn Pitch Deck v3.pptx
├── src/
│ ├── app/
│ │ ├── api/
│ │ │ ├── chat/
│ │ │ │ └── route.ts
│ │ │ └── route.ts
│ │ ├── page.tsx
│ │ └── styles.css
│ ├── components/
│ │ └── ui/
│ ├── hooks/
│ └── lib/
├── prisma/
│ └── schema.prisma
├── public/
├── db/
├── package.json
├── tailwind.config.ts
└── tsconfig.json

text


---

## Getting Started

### Prerequisites

- **Node.js** >= 18.x or **Bun** runtime
- **Elasticsearch Cloud Account** with Agent Builder enabled
- **AWS Account** (optional for deployment)

### Environment Variables

Create a `.env` file in the root directory:

```env
# Elasticsearch Configuration
KIBANA_URL=https://your-cluster.us-central1.gcp.cloud.es.io
ELASTIC_API_KEY=your_elastic_api_key
ELASTIC_AGENT_ID=your_agent_id

# Database
DATABASE_URL="file:./dev.db"
Installation
bash

# Clone the repository
git clone https://github.com/AakarshanManiGiri/AWS-Elastic-Hackathon.git
cd AWS-Elastic-Hackathon

# Install dependencies (using Bun)
bun install

# Generate Prisma client
bun run db:generate

# Push database schema
bun run db:push

# Start development server
bun run dev
Development
bash

# Run development server
bun run dev

# Run linting
bun run lint

# Build for production
bun run build

# Start production server
bun run start
API Reference
POST /api/chat
Send a message to the guardAIn assistant.

Request Body:

typescript

interface ChatRequest {
  message: string;                    // User's query
  attachedFile?: {
    name: string;                     // File name
    type: string;                     // MIME type
    data: string;                     // Base64 encoded data
  };
  conversationId?: string;            // For multi-turn conversations
}
Response:

typescript

interface ChatResponse {
  response: string;                   // HTML-formatted AI response
  reasoning: string[];                // Array of reasoning steps
  conversationId: string;             // Conversation identifier
}
Example:

bash

curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "My landlord wants to increase rent by 15%. Is this legal?"
  }'
Use Cases
1. Rent Increase Queries
User: "My landlord wants to increase my rent by $50 per week. What are my rights in NSW?"

guardAIn: Analyzes NSW tenancy law and provides:

Legal notice period requirements
Maximum increase frequency
Dispute resolution options
Relevant NSW Fair Trading links
2. Repair Request Assistance
User: "My hot water system has been broken for 2 weeks. What can I do?"

guardAIn: Provides step-by-step guidance:

Urgent repair classification
Notification requirements
Timeframes for landlord response
Tribunal application process
3. Bond Dispute Resolution
User: [Uploads final inspection report] "My landlord is claiming $800 for cleaning. Is this fair?"

guardAIn: Reviews document and advises:

Fair wear and tear vs damage
Cleaning standard expectations
Dispute resolution steps
NCAT application process
Privacy & Disclaimer
Important Notice
guardAIn provides information for reference purposes only. This system is not a substitute for professional legal advice.

Consult a qualified legal professional for specific legal advice.
Contact NSW Fair Trading for official guidance: 13 32 20.
NSW Civil and Administrative Tribunal (NCAT) for dispute resolution.
Data Handling
User queries are processed through Elasticsearch Agent Builder.
Conversation data may be stored for service improvement.
File attachments are processed temporarily and not permanently stored.
Future Roadmap
 Voice Interface - Speech-to-text for accessibility.
 Multi-Language Support - Translations for non-English speakers.
 Document Generation - Auto-generate formal letters and notices.
 Integration APIs - Connect with NSW Fair Trading systems.
 Mobile App - Native iOS/Android applications.
Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request
License
This project is open source and available under the MIT License.
