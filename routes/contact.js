const express = require('express');
const { Resend } = require('resend');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const router = express.Router();

const resend = new Resend(process.env.RESEND_API_KEY);

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    const date = new Date().toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    const htmlContent = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Nouveau message - Portfolio Amy Diallo</title>
</head>
<body style="margin:0;padding:0;background-color:#eef3f9;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#eef3f9;">
<tr>
<td style="padding:30px 15px;" align="center">

<!-- Container -->
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #dce6f0;">

<!-- Header bleu marine -->
<tr>
<td style="background-color:#0b1a2e;padding:30px 40px;text-align:center;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td align="center">
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="width:40px;height:40px;background-color:#4a90d9;border-radius:50%;text-align:center;vertical-align:middle;font-size:18px;color:#ffffff;font-weight:bold;">A</td>
<td style="padding-left:12px;">
<p style="margin:0;font-size:20px;font-weight:bold;color:#85c1e9;letter-spacing:1px;">Amy Diallo</p>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td align="center" style="padding-top:8px;">
<p style="margin:0;font-size:12px;color:#8faabe;letter-spacing:2px;text-transform:uppercase;">Portfolio &mdash; Nouveau Message</p>
</td>
</tr>
</table>
</td>
</tr>

<!-- Bande bleue decorative -->
<tr>
<td style="background-color:#4a90d9;height:4px;font-size:0;line-height:0;">&nbsp;</td>
</tr>

<!-- Date -->
<tr>
<td style="padding:28px 40px 0 40px;">
<p style="margin:0;font-size:13px;color:#8faabe;">${date}</p>
</td>
</tr>

<!-- Sender Info -->
<tr>
<td style="padding:20px 40px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f8fc;border-left:4px solid #4a90d9;border-radius:8px;">
<tr>
<td style="padding:18px 22px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="padding-bottom:10px;">
<span style="font-size:12px;color:#8faabe;text-transform:uppercase;letter-spacing:1px;">Expediteur</span>
</td>
</tr>
<tr>
<td style="padding-bottom:6px;">
<span style="font-size:15px;font-weight:bold;color:#1b2838;">${name}</span>
</td>
</tr>
<tr>
<td>
<a href="mailto:${email}" style="font-size:14px;color:#4a90d9;text-decoration:none;">${email}</a>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>

<!-- Message label -->
<tr>
<td style="padding:0 40px 10px 40px;">
<p style="margin:0;font-size:12px;color:#8faabe;text-transform:uppercase;letter-spacing:1px;">Message</p>
</td>
</tr>

<!-- Message content -->
<tr>
<td style="padding:0 40px 28px 40px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f8fc;border:1px solid #d6eaf8;border-radius:8px;">
<tr>
<td style="padding:20px 22px;font-size:14px;color:#1b2838;line-height:24px;">
${message.replace(/\n/g, '<br/>')}
</td>
</tr>
</table>
</td>
</tr>

<!-- Reply Button -->
<tr>
<td style="padding:0 40px 32px 40px;" align="center">
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="background-color:#4a90d9;border-radius:8px;">
<a href="mailto:${email}" style="display:inline-block;padding:14px 36px;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;letter-spacing:0.5px;">&#9993; R&eacute;pondre &agrave; ${name}</a>
</td>
</tr>
</table>
</td>
</tr>

<!-- Separator -->
<tr>
<td style="padding:0 40px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="border-top:1px solid #d6eaf8;font-size:0;line-height:0;height:1px;">&nbsp;</td>
</tr>
</table>
</td>
</tr>

<!-- Footer -->
<tr>
<td style="padding:20px 40px 28px 40px;text-align:center;">
<p style="margin:0;font-size:12px;color:#8faabe;line-height:18px;">Ce message a &eacute;t&eacute; envoy&eacute; depuis le formulaire de contact<br/>du portfolio de Amy Diallo.</p>
</td>
</tr>

</table>
<!-- End Container -->

</td>
</tr>
</table>
</body>
</html>`;

    await resend.emails.send({
      from: `Portfolio Amy Diallo <${process.env.RESEND_FROM_EMAIL}>`,
      to: [process.env.EMAIL_TO],
      replyTo: email,
      subject: `Nouveau message de ${name} — Portfolio Amy Diallo`,
      html: htmlContent
    });

    res.json({ message: 'Message envoyé avec succès' });
  } catch (error) {
    console.error('Erreur envoi email:', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi du message' });
  }
});

module.exports = router;
