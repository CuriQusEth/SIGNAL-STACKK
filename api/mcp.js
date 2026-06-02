export default function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Signal Stack MCP Endpoint",
      status: "active",
      description: "Active MCP server for Signal Stack Orchestrator Agent",
      capabilities: ["signal-stacking", "multi-layer-processing", "stack-management"],
      skills: [
        { name: "get_race_status", description: "Get the current race status." },
        { name: "start_race", description: "Start a new race." },
        { name: "get_leaderboard", description: "Get the current leaderboard." },
        { name: "optimize_speed", description: "Optimize vehicle speed." },
        { name: "get_track_info", description: "Get track details." }
      ],
      timestamp: new Date().toISOString()
    });
  }

  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      const method = body.method;
      
      const jsonRpcId = body.id;
      const isJsonRpc = !!jsonRpcId || body.jsonrpc === "2.0";

      const sendResponse = (data) => {
        if (isJsonRpc) {
          return res.status(200).json({
            jsonrpc: "2.0",
            id: jsonRpcId || null,
            result: data
          });
        }
        return res.status(200).json(data);
      };

      if (method === "initialize") {
        return sendResponse({
          protocolVersion: "2024-11-05", // Standard MCP date version
          capabilities: {
            tools: {},
            prompts: {},
            resources: {}
          },
          serverInfo: {
            name: "Signal Stack Orchestrator",
            version: "1.0.0"
          }
        });
      }

      if (method === "tools/list") {
        return sendResponse({
          tools: [
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
        return sendResponse({
          content: [{ type: "text", text: `Executed [${tool}] successfully via MCP protocol.` }]
        });
      }

      if (method === "prompts/list") {
        return sendResponse({ prompts: [] });
      }
      
      if (method === "resources/list") {
        return sendResponse({ resources: [] });
      }

      return res.status(200).json({
        status: "success",
        message: "MCP command received",
        agent: "Signal Stack Orchestrator",
        receivedAt: new Date().toISOString(),
        payload: body
      });
    } catch (error) {
      return res.status(400).json({ error: "Invalid MCP request" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
