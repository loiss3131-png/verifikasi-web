module.exports = function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({message:'Metode tidak diizinkan'});
  const siteKey=process.env.RECAPTCHA_SITE_KEY;
  const destination=process.env.DESTINATION_URL;
  if (!siteKey || !destination) return res.status(503).json({message:'Atur RECAPTCHA_SITE_KEY dan DESTINATION_URL di Vercel terlebih dahulu.'});
  try {
    const url=new URL(destination);
    if (url.protocol!=='https:') throw new Error('URL harus HTTPS');
    res.setHeader('Cache-Control','no-store');
    return res.status(200).json({siteKey,destination:url.href});
  } catch { return res.status(503).json({message:'DESTINATION_URL harus URL HTTPS yang valid.'}); }
};
