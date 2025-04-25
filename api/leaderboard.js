export default async function handler(req, res) {
  const response = await fetch('https://qahumzjqhxaomrohwwyx.supabase.co/rest/v1/scores?select=initials,score&order=score.desc&limit=10', {
    headers: {
      apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhaHVtempxaHhhb21yb2h3d3l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NTk0MjgsImV4cCI6MjA2MTEzNTQyOH0.1OhGPIbzhFiiV8I3cpa31H_2IL4aQNlCdsenv5s4NVw',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhaHVtempxaHhhb21yb2h3d3l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NTk0MjgsImV4cCI6MjA2MTEzNTQyOH0.1OhGPIbzhFiiV8I3cpa31H_2IL4aQNlCdsenv5s4NVw',
    }
  });

  const data = await response.json();
  res.status(200).json(data);
}
