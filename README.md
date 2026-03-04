# guardAIn - NSW Tenant Assistant

> A recognised submission for the Elastic/AWS Forge the Future Hackathon

---

## Overview

guardAIn is an AI-powered tenancy information assistant designed to help New South Wales tenants understand their rights and navigate rental disputes. This project was developed as part of the Forge the Future hackathon, an event sponsored by Elastic and AWS that challenged participants to leverage AI and data to solve real-world problems.

The application uses Elasticsearch's Agent Builder with RAG (Retrieval-Augmented Generation) capabilities to provide contextual information about NSW tenancy legislation. It offers guidance on common rental issues such as rent increases, repair requests, bond disputes, and lease reviews.

**Important Disclaimer:** This system provides information for reference purposes only. It is not a substitute for professional legal advice. Users should consult qualified legal professionals for specific legal matters and contact NSW Fair Trading for official guidance.

---

## Features

### Intelligent Tenancy Assistance
- Lease review analysis and guidance
- Repair request walkthroughs
- Rent increase validation against NSW regulations
- Bond dispute information
- References to NSW Fair Trading resources

### AI-Powered Reasoning
- Multi-step analysis with visual breakdown
- Transparent processing pipeline
- Multi-turn conversation support
- References to applicable legislation

### Document Support
- File attachment capability (images, PDFs, documents)
- Contextual integration with user queries

### Conversation Management
- Conversation history tracking
- Recent cases sidebar for quick access
- New chat functionality

---

## Architecture

```
Frontend (Next.js + React)
         |
         v
Backend API (/api/chat endpoint)
         |
         v
Elasticsearch Agent Builder (RAG)
         |
         v
Database (Prisma + SQLite)
```

---

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- shadcn/ui components
- Radix UI primitives
- Framer Motion

### Backend
- Next.js API Routes
- Prisma ORM
- SQLite

### AI & Infrastructure
- Elasticsearch Agent Builder
- Elastic Cloud
- AWS infrastructure
- Caddy reverse proxy

---

## Project Structure

```
AWS-Elastic-Hackathon/
├── Pitch Deck/
│   └── guardAIn Pitch Deck v3.pptx
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   ├── page.tsx
│   │   └── styles.css
│   ├── components/
│   │   └── ui/
│   ├── hooks/
│   └── lib/
├── prisma/
│   └── schema.prisma
├── public/
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── Caddyfile
```

---

## Getting Started

### Prerequisites
- Node.js 18.x or Bun runtime
- Elasticsearch Cloud account with Agent Builder enabled

### Environment Variables

Create a `.env` file:

```env
# Elasticsearch Configuration
KIBANA_URL=https://your-cluster.us-central1.gcp.cloud.es.io
ELASTIC_API_KEY=your_elastic_api_key
ELASTIC_AGENT_ID=your_agent_id

# Database
DATABASE_URL="file:./dev.db"
```

### Installation

```bash
# Clone the repository
git clone https://github.com/AakarshanManiGiri/AWS-Elastic-Hackathon.git
cd AWS-Elastic-Hackathon

# Install dependencies
bun install

# Setup database
bun run db:generate
bun run db:push

# Start development server
bun run dev
```

---

## API Reference

### POST /api/chat

Send a message to the assistant.

**Request:**
```json
{
  "message": "string",
  "attachedFile": {
    "name": "string",
    "type": "string",
    "data": "string (base64)"
  },
  "conversationId": "string (optional)"
}
```

**Response:**
```json
{
  "response": "string (HTML-formatted)",
  "reasoning": ["string"],
  "conversationId": "string"
}
```

---

## Example Use Cases

### Rent Increase Queries
Users can ask about rent increase regulations and receive information about notice periods, frequency limits, and dispute resolution options.

### Repair Request Assistance
The system provides step-by-step guidance for urgent repair situations, including notification requirements and timeframes.

### Bond Dispute Information
Users can upload inspection reports and receive information about fair wear and tear versus damage, cleaning standards, and dispute processes.

---

## Privacy and Disclaimer

**This system provides information for reference purposes only.**

- Consult a qualified legal professional for specific legal advice
- Contact NSW Fair Trading (13 32 20) for official guidance
- NSW Civil and Administrative Tribunal (NCAT) handles dispute resolution

---

## About the Hackathon

The Forge the Future hackathon is sponsored by Elastic and AWS, challenging participants to develop AI-powered solutions across sectors including banking, healthcare, ecommerce, and public services.

This project was developed as a learning experience to explore:
- RAG (Retrieval-Augmented Generation) implementation
- Elasticsearch Agent Builder integration
- Real-world application of AI in legal information access

---

## Future Improvements

Potential areas for future development:
- Voice interface for accessibility
- Multi-language support
- Document generation for formal notices
- Integration with NSW Fair Trading APIs
- Mobile application

---

## License

This project is available under the MIT License.

---

## Contact

**Maintainer:** Aakarshan Mani Giri
**GitHub:** [@AakarshanManiGiri](https://github.com/AakarshanManiGiri)
**Repository:** [AWS-Elastic-Hackathon](https://github.com/AakarshanManiGiri/AWS-Elastic-Hackathon)
