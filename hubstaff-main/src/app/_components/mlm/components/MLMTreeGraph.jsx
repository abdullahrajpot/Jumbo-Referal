import React from "react";
import Tree from "react-d3-tree";
import { Avatar, Typography, Tooltip } from "@mui/material";

// Color scale for levels (darker for root, lighter for leaves)
const levelColors = [
  "#0d47a1", // root
  "#1976d2",
  "#42a5f5",
  "#90caf9",
  "#e3f2fd"
];

// Custom node renderer for org chart style with tooltip on hover (show email)
const renderNode = ({ nodeDatum }) => {
  const level = nodeDatum.attributes.Level || 0;
  const color = levelColors[level] || "#e3f2fd";
  // Extract email from nodeDatum (assume name and email are separated by ' (' and ')')
  let email = "";
  let displayName = nodeDatum.name;
  const match = nodeDatum.name.match(/^(.*) \((.*)\)$/);
  if (match) {
    displayName = match[1];
    email = match[2];
  }
  return (
    <foreignObject width={100} height={100} x={-50} y={-50}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Avatar
          sx={{
            width: 56,
            height: 56,
            bgcolor: color,
            border: "3px solid #fff",
            boxShadow: "0 2px 8px #0002"
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4" fill="#fff" />
            <ellipse cx="12" cy="18" rx="8" ry="5" fill="#fff" />
          </svg>
        </Avatar>
        <Tooltip title={email || displayName} placement="top">
          <Typography
            fontWeight={700}
            fontSize={13}
            align="center"
            sx={{
              mt: 1,
              maxWidth: 90,
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap"
            }}
            noWrap
          >
            {displayName}
          </Typography>
        </Tooltip>
      </div>
    </foreignObject>
  );
};

const convertToD3 = (node) => {
  if (!node) return null;
  return {
    name: node.name + (node.email ? ` (${node.email})` : ""),
    attributes: { Level: node.level },
    children: node.children ? node.children.map(convertToD3) : [],
  };
};

const MLMTreeGraph = ({ treeData }) => {
  if (!treeData) return <div>No tree data available.</div>;
  const d3Data = convertToD3(treeData);

  const nodeSize = { x: 160, y: 120 };
  const separation = { siblings: 1.5, nonSiblings: 2 };

  return (
    <div style={{ width: "100%", height: "650px", background: "linear-gradient(120deg, #f5f7fa 0%, #e3f2fd 100%)", borderRadius: 12, padding: 16 }}>
      <Tree
        data={d3Data}
        orientation="vertical"
        nodeSize={nodeSize}
        separation={separation}
        zoomable
        translate={{ x: 500, y: 100 }}
        pathFunc="diagonal"
        renderCustomNodeElement={renderNode}
        collapsible={false}
      />
    </div>
  );
};

export default MLMTreeGraph; 