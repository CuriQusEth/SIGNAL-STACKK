import { NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS requests (CORS preflight)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
}

export async function GET() {
  return NextResponse.json({
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
  }, { headers: CORS_HEADERS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const method = body.method;

    if (method === "initialize") {
      return NextResponse.json({
        protocolVersion: "1.0.0",
        capabilities: {},
        serverInfo: {
          name: "Signal Stack Orchestrator",
          version: "1.0.0"
        }
      }, { headers: CORS_HEADERS });
    }

    if (method === "tools/list") {
      return NextResponse.json({
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
      }, { headers: CORS_HEADERS });
    }

    if (method === "tools/call") {
      const tool = body.params?.name;
      return NextResponse.json({
        content: [{ type: "text", text: `Executed [${tool}] successfully via MCP protocol.` }]
      }, { headers: CORS_HEADERS });
    }

    if (method === "prompts/list" || method === "resources/list") {
      return NextResponse.json({ prompts: [], resources: [] }, { headers: CORS_HEADERS });
    }

    return NextResponse.json({
      status: "success",
      message: "MCP command received",
      agent: "Signal Stack Orchestrator",
      receivedAt: new Date().toISOString(),
      payload: body
    }, { headers: CORS_HEADERS });

  } catch (error) {
    return NextResponse.json({ error: "Invalid MCP request" }, { status: 400, headers: CORS_HEADERS });
  }
}
