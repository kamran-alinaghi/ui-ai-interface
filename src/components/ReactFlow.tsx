import React, { useState } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  applyNodeChanges,
  OnNodesChange,
} from 'reactflow';

import 'reactflow/dist/style.css';

export default function FlowChart() {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: '1',
      position: { x: 10, y: 120 },
      data: { label: 'my Node' },
      type: 'default',
    },
  ]);

  const [edges, setEdges] = useState<Edge[]>([]);
  const handleNodesChange: OnNodesChange = (changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  };
  return (
    <div style={{ width: '800px', height: '800px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange} // 🔑 this line is essential
      />
    </div>
  );
}
