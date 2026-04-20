import path from 'path';

// simple upload handler: returns file info and mock prediction link
export async function handleUpload(req, res) {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const fileUrl = `/uploads/${req.file.filename}`;
  // optionally: call prediction here or queue it
  res.json({ ok: true, file: fileUrl, filename: req.file.filename });
}
