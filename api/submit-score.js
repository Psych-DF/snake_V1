export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { initials, score } = req.body;

  if (!initials || typeof score !== 'number') {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const response = await fetch('https://qahumzjqhxaomrohwwyx.supabase.co/rest/v1/scores', {
    method: 'POST',
    headers: {
      apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhaHVtempxaHhhb21yb2h3d3l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NTk0MjgsImV4cCI6MjA2MTEzNTQyOH0.1OhGPIbzhFiiV8I3cpa31H_2IL4aQNlCdsenv5s4NVw',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhaHVtempxaHhhb21yb2h3d3l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NTk0MjgsImV4cCI6MjA2MTEzNTQyOH0.1OhGPIbzhFiiV8I3cpa31H_2IL4aQNlCdsenv5s4NVw',
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    },
    body: JSON.stringify({ initials, score })
  });

  const data = await response.json();
  res.status(200).json(data);
}
