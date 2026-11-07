module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control','no-store');
  if (req.method !== 'POST') return res.status(405).json({success:false,message:'Metode tidak diizinkan'});
  const secret=process.env.RECAPTCHA_SECRET_KEY;
  const destination=process.env.DESTINATION_URL;
  if (!secret || !destination) return res.status(503).json({success:false,message:'Konfigurasi server belum lengkap'});
  const token=req.body && req.body.token;
  if (typeof token!=='string'||token.length<10||token.length>5000) return res.status(400).json({success:false,message:'Token tidak valid'});
  try {
    const params=new URLSearchParams({secret,response:token});
    const r=await fetch('https://www.google.com/recaptcha/api/siteverify',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:params.toString(),signal:AbortSignal.timeout(8000)});
    if (!r.ok) throw new Error('Google verification unavailable');
    const result=await r.json();
    const allowedHosts=(process.env.ALLOWED_HOSTNAMES||'').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);
    const hostOK=allowedHosts.length>0&&allowedHosts.includes(String(result.hostname||'').toLowerCase());
    if(!result.success||result.action!=='continue'||Number(result.score)<0.5||!hostOK){return res.status(403).json({success:false,message:'Verifikasi gagal. Silakan coba lagi.'})}
    const url=new URL(destination);if(url.protocol!=='https:')throw new Error('Invalid destination');
    return res.status(200).json({success:true,redirect:url.href});
  } catch {return res.status(502).json({success:false,message:'Server verifikasi sedang bermasalah. Coba lagi nanti.'})}
};
