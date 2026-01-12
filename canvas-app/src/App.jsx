import { useState, useEffect } from 'react';
import Table from './components/Table';
import LineGraph from './components/LineGraph';
import BarChart from './components/BarChart';

function App() {
  const [data, setData] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8081');

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        console.log('Received data:', parsed);
        setData(parsed);
      } catch (e) {
        console.error('Failed to parse data:', e);
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
      setConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  const renderData = () => {
    if (!data) {
      return <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>
        {connected ? 'Canvas ready. Waiting for data...' : 'Connecting...'}
      </div>;
    }

    // Check if data has a visualization type specified
    if (data.type && data.data) {
      const vizData = data.data;
      const { xKey, yKey, yKeys, colors, label } = data;

      switch (data.type) {
        case 'line':
          return <LineGraph data={vizData} xKey={xKey} yKey={yKey} yKeys={yKeys} colors={colors} label={label} />;
        case 'bar':
          return <BarChart data={vizData} xKey={xKey} yKey={yKey} label={label} />;
        case 'table':
          return <Table data={vizData} />;
        default:
          return <pre>{JSON.stringify(data, null, 2)}</pre>;
      }
    }

    // If data is an array of objects, render as table
    if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
      return <Table data={data} />;
    }

    // Otherwise render as JSON
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
  };

  return (
    <>
      <div style={{
        padding: '1rem 2rem',
        borderBottom: '1px solid #333',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>whiff</div>
        <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>
          {connected ? '●' : '○'} {connected ? 'connected' : 'disconnected'}
        </div>
      </div>
      <div id="canvas">
        {renderData()}
      </div>
    </>
  );
}

export default App;
