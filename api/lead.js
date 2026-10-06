export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId   = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return res.status(500).json({ error: 'Lead delivery not configured' });

  let payload;
  try {
    payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  const formData = payload?.formData || {};
  const source   = payload?.source || 'cdsigrl.theboostnation.space';
  if (!formData.name || !formData.email) return res.status(400).json({ error: 'Name and email are required' });

  const sanitize = s => String(s).slice(0, 2000).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  let msg = `🏛️ <b>New CDS IGRL Lead</b>\n<b>Source:</b> ${sanitize(source)}\n<b>Time:</b> ${new Date().toUTCString()}\n\n`;
  for (const [key, value] of Object.entries(formData)) {
    if (value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && !value.length)) {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
      const val   = Array.isArray(value) ? value.join(', ') : value;
      msg += `<b>${sanitize(label)}:</b> ${sanitize(val)}\n`;
    }
  }

  const tg = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'HTML', disable_web_page_preview: true })
  });
  if (!tg.ok) return res.status(502).json({ error: 'Lead delivery failed' });

  return res.status(200).json({ ok: true });
}
