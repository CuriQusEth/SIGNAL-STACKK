# SIGNAL STACK

A satisfying, addictive, and visually stunning neon stacking game on Base Mainnet.

## Game Concept

**SIGNAL STACK** is a satisfying, addictive, and visually stunning stacking game where you build the tallest **Signal Tower** by dropping glowing signal blocks. Time your drops perfectly to create massive chain reactions and build the highest, most stable signal tower in the universe.

## Core Gameplay

- Classic stacking mechanics: Tap or swipe at the right moment to drop glowing signal blocks.
- Blocks fall from the top and must land perfectly on the tower.
- Create **Signal Chains** by connecting same-colored or same-frequency blocks.
- Chain reactions trigger beautiful cascade effects and massive score multipliers.
- The tower becomes increasingly unstable as it grows taller — balance is key.
- Increasing speed and difficulty as the tower rises.

## Features

- Fully responsive, portrait mode optimized
- High-performance Canvas with physics and stacking system
- Wagmi + Viem + Base Account connectivity
- ERC-8021 Transaction Attribution support
- ERC-8004 Trustless Agents protocol endpoints
- SIWE (Sign-In with Ethereum) real transaction score submission

## Tech Stack

- React
- Vite
- Express
- Tailwind CSS
- Matter.js
- Framer Motion
- Wagmi / Viem
- Zustand

## Deployment

To deploy this project to a standard host:

1. Build the project:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm start
   ```

## Agent Protocol endpoints

The application exposes Agent / MCP Protocol endpoints:
* `GET /.well-known/agent-card.json` - Agent capabilities configuration
* `GET /api/agent` - Main agent control API
* `GET /api/mcp` - MCP details
* `POST /api/mcp` - MCP command execution
