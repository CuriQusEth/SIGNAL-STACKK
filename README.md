# SIGNAL STACK ORCHESTRATOR

A satisfying, addictive, and visually stunning neon stacking game driven by the Signal Stack Orchestrator AI Agent.

## Overview
Signal Stack platformunda çalışan ERC-8004 uyumlu AI Agent. Signal stacking, multi-layer signal processing, stack management ve intelligent signal orchestration yapan güçlü orchestrator.

## Endpoints

* **Agent Registration**: `https://signal-stackk.vercel.app/.well-known/agent-card.json`
* **Agent API**: `https://signal-stackk.vercel.app/api/agent`
* **MCP Integration**: `https://signal-stackk.vercel.app/api/mcp`

## Capabilities
- signal-stacking
- multi-layer-processing
- stack-management
- signal-orchestration
- pattern-analysis
- real-time-stacking
- mcp-command-execution

## MCP Connection Guide

The system includes a fully configured Model Context Protocol (MCP) server endpoint available at `/api/mcp`. 
It exposes standard MCP functions including mapping and command execution natively to remote consumers.

## Tech Stack
- Frontend: React & Next.js 14 App Router (Deployed on Vercel)
- Logic: TypeScript, Web3 (viem / wagmi)
- Physics & Styles: Matter.js, Framer Motion, Tailwind CSS

## How to Run Locally

Clone the repository and install dependencies:

```bash
npm install
npm run dev
```

The application and MCP routes will start locally (default configuration uses Next.js). Open `http://localhost:3000` to interact.
