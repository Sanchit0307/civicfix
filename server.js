const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Mock API for demo comparison - replace with real NVIDIA API integration
app.post('/api/generate-letter', (req, res) => {
    const { name, location, type, desc } = req.body;

    // Simulate AI processing delay
    setTimeout(() => {
        // Mock response - in real implementation, this would come from NVIDIA API
        const mockResponse = {
            letter: `To,\nThe Municipal Corporation,\n${location}\n\nSubject: Formal Complaint Regarding ${type}\n\nDear Sir/Madam,\n\nI am writing to complain about ${desc}.\n\nPlease take action.\n\nRegards,\n${name}`,
            tid: 'CF-2026-001',
            category: 'Infrastructure',
            urgency: 'High',
            authority: 'Municipal Corporation',
            email: 'complaints@municipal.gov'
        };

        res.json(mockResponse);
    }, 2000); // Simulate API delay
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});