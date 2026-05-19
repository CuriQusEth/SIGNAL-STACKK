import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Enable CORS for all API routes
  app.use("/api", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    next();
  });

  // MCP GET Endpoint
  app.get("/api/mcp", (req, res) => {
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Signal Stack MCP Endpoint",
      status: "active",
      description: "Active MCP server for Signal Stack Orchestrator Agent",
      capabilities: ["signal-stacking", "multi-layer-processing", "stack-management"],
      timestamp: new Date().toISOString()
    });
  });

  // MCP POST Endpoint
  app.post("/api/mcp", (req, res) => {
    try {
      const body = req.body;
      const method = body.method;

      if (method === "initialize") {
        return res.json({
          protocolVersion: "1.0.0",
          capabilities: {},
          serverInfo: {
            name: "Signal Stack Orchestrator",
            version: "1.0.0"
          }
        });
      }

      if (method === "tools/list") {
        return res.json({
          tools: [
            { name: "get_race_status", description: "Get the current race status.", inputSchema: { type: "object", properties: {} } },
            { name: "start_race", description: "Start a new race.", inputSchema: { type: "object", properties: {} } },
            { name: "get_leaderboard", description: "Get the current leaderboard.", inputSchema: { type: "object", properties: {} } },
            { name: "optimize_speed", description: "Optimize vehicle speed.", inputSchema: { type: "object", properties: {} } },
            { name: "get_track_info", description: "Get track details.", inputSchema: { type: "object", properties: {} } }
          ],
          skills: [
            { name: "get_race_status", description: "Get the current race status.", inputSchema: { type: "object", properties: {} } },
            { name: "start_race", description: "Start a new race.", inputSchema: { type: "object", properties: {} } },
            { name: "get_leaderboard", description: "Get the current leaderboard.", inputSchema: { type: "object", properties: {} } },
            { name: "optimize_speed", description: "Optimize vehicle speed.", inputSchema: { type: "object", properties: {} } },
            { name: "get_track_info", description: "Get track details.", inputSchema: { type: "object", properties: {} } }
          ]
        });
      }

      if (method === "tools/call") {
        const tool = body.params?.name;
        return res.json({
          content: [{ type: "text", text: `Executed [${tool}] successfully via MCP protocol.` }]
        });
      }

      if (method === "prompts/list" || method === "resources/list") {
        return res.json({ prompts: [], resources: [] });
      }

      res.json({
        status: "success",
        message: "MCP command received",
        agent: "Signal Stack Orchestrator",
        receivedAt: new Date().toISOString(),
        payload: body
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid MCP request" });
    }
  });

  // Agent API Endpoint
  app.get("/api/agent", (req, res) => {
    res.json({
      name: "Signal Stack Orchestrator",
      status: "active",
      wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
      platform: "Signal Stack",
      version: "1.0.0"
    });
  });

  app.post("/api/agent", (req, res) => {
    try {
      res.json({
        status: "success",
        message: "Agent updated successfully",
        receivedAt: new Date().toISOString(),
        payload: req.body
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid payload" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
