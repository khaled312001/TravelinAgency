const express = require('express');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle API routes by calling PHP script
app.use('/api', (req, res) => {
  const php = spawn('php', ['api-handler.php'], {
    cwd: __dirname,
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  // Set environment variables for PHP
  php.env.REQUEST_METHOD = req.method;
  php.env.REQUEST_URI = req.originalUrl;
  php.env.QUERY_STRING = req.url.split('?')[1] || '';
  php.env.CONTENT_TYPE = req.get('Content-Type') || '';
  php.env.CONTENT_LENGTH = req.get('Content-Length') || '0';
  
  // Forward request body to PHP
  if (req.method === 'POST' || req.method === 'PUT') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      php.stdin.write(body);
      php.stdin.end();
    });
  } else {
    php.stdin.end();
  }
  
  // Forward response from PHP
  let responseData = '';
  php.stdout.on('data', (data) => {
    responseData += data.toString();
  });
  
  php.stdout.on('end', () => {
    // Parse response headers if any
    const lines = responseData.split('\n');
    let bodyStart = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === '') {
        bodyStart = i + 1;
        break;
      }
      if (line.includes(':')) {
        const [key, value] = line.split(':', 2);
        res.set(key.trim(), value.trim());
      }
    }
    
    const body = lines.slice(bodyStart).join('\n');
    res.send(body);
  });
  
  php.stderr.on('data', (data) => {
    console.error('PHP Error:', data.toString());
  });
  
  php.on('close', (code) => {
    if (code !== 0) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

// Handle all other routes - serve the main HTML file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
