import mongoose from "mongoose";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import axios from "axios";
import FinalTeam from "./src/models/FinalTeam.js";

dotenv.config();

/* ---------------- HARD CODE REGISTRATION ID ---------------- */
const REGISTRATION_ID = "RD294";

/* ---------------- EMAIL ACCOUNTS POOL ---------------- */
const emailAccounts = [
  { user: process.env.EMAIL_USER2, pass: process.env.EMAIL_PASS2 },
  { user: process.env.EMAIL_USER3, pass: process.env.EMAIL_PASS3 },
  { user: process.env.EMAIL_USER4, pass: process.env.EMAIL_PASS4 },
  { user: process.env.EMAIL_USER5, pass: process.env.EMAIL_PASS5 },
  { user: process.env.EMAIL_USER6, pass: process.env.EMAIL_PASS6 },
];

/* ---------------- FETCH IMAGE BUFFER ---------------- */
const fetchImageBuffer = async (url) => {
  const res = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(res.data);
};

/* ---------------- SEND WITH FAILOVER ---------------- */
const sendEmailWithFailover = async ({ finalTeam, attachments }) => {
  for (const account of emailAccounts) {
    if (!account.user || !account.pass) continue;

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      const participants = [
        { role: "Leader", ...finalTeam.leader },
        ...finalTeam.members.map((m) => ({ role: "Member", ...m })),
      ];

  const rows = [
  `
  <tr style="border-bottom: 1px solid #e2e8f0; background-color: #ffffff;">
    <td style="padding: 12px 8px; color: #0891b2; font-weight: 600; font-size: 13px; background-color: #ffffff;">Leader</td>
    <td style="padding: 12px 8px; color: #1e293b; font-size: 14px; background-color: #ffffff;">${finalTeam.leader.name}</td>
    <td style="padding: 12px 8px; color: #64748b; font-size: 13px; background-color: #ffffff;">${finalTeam.leader.college}</td>
    <td style="padding: 12px 8px; color: #94a3b8; text-align: right; font-family: 'Courier New', monospace; font-size: 12px; background-color: #ffffff;">
      ${finalTeam.leader.participantId}
    </td>
  </tr>
  `,
  ...finalTeam.members.map(
    (m) => `
    <tr style="border-bottom: 1px solid #e2e8f0; background-color: #ffffff;">
      <td style="padding: 12px 8px; color: #64748b; font-size: 13px; background-color: #ffffff;">Member</td>
      <td style="padding: 12px 8px; color: #1e293b; font-size: 14px; background-color: #ffffff;">${m.name}</td>
      <td style="padding: 12px 8px; color: #64748b; font-size: 13px; background-color: #ffffff;">${m.college}</td>
      <td style="padding: 12px 8px; color: #94a3b8; text-align: right; font-family: 'Courier New', monospace; font-size: 12px; background-color: #ffffff;">
        ${m.participantId}
      </td>
    </tr>
    `
  ),
].join("");

await transporter.sendMail({
  from: `"CODEFUSION" <${account.user}>`,
  to: finalTeam.leader.email,
  subject: "🎫 CODEFUSION Hackathon – Team Metadata & Secure Entry QR Codes",
  html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>CODEFUSION 2026 Registration</title>
    <style type="text/css">
        body { margin: 0; padding: 0; background-color: #f8fafc !important; }
        table { border-collapse: collapse; }
        td { background-color: inherit; }
        .email-container { background-color: #ffffff !important; }
        .header-section { background-color: #ffffff !important; }
        .content-section { background-color: #ffffff !important; }
        .footer-section { background-color: #f8fafc !important; }
        @media only screen and (max-width: 600px) {
            .responsive-table { width: 100% !important; }
            .padding-mobile { padding: 20px 16px !important; }
        }
    </style>
    <!--[if mso]>
    <style type="text/css">
        table { border-collapse: collapse; }
    </style>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
    
    <!-- Wrapper Table for Email Clients -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc;">
        <tr>
            <td style="padding: 20px 10px; background-color: #f8fafc;">
                
                <!-- Main Container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="email-container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
                    
                    <!-- Header -->
                    <tr>
                        <td class="header-section" style="background-color: #ffffff; border-bottom: 3px solid #0891b2; padding: 32px 24px; text-align: center;">
                            <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #0f172a; letter-spacing: 0.5px;">CODEFUSION 2026</h1>
                            <p style="margin: 8px 0 0 0; color: #64748b; font-size: 14px; font-weight: 500;">Payment Confirmation & Team Roster</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td class="content-section padding-mobile" style="padding: 32px 24px; background-color: #ffffff;">
                            
                            <!-- Team Info Grid -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px; background-color: #ffffff;">
                                <tr>
                                    <td style="padding-bottom: 24px; border-bottom: 2px solid #f1f5f9; background-color: #ffffff;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff;">
                                            <tr>
                                                <td style="padding: 0 8px 16px 0; vertical-align: top; width: 50%; background-color: #ffffff;">
                                                    <p style="margin: 0; font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Team Name</p>
                                                    <p style="margin: 6px 0 0 0; font-size: 16px; font-weight: 600; color: #0f172a; line-height: 1.3;">${finalTeam.teamName}</p>
                                                </td>
                                                <td style="padding: 0 0 16px 8px; vertical-align: top; width: 50%; background-color: #ffffff;">
                                                    <p style="margin: 0; font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Final Team ID</p>
                                                    <p style="margin: 6px 0 0 0; font-size: 16px; font-weight: 600; color: #0f172a; line-height: 1.3;">${finalTeam.finalTeamId}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 0 8px 0 0; vertical-align: top; width: 50%; background-color: #ffffff;">
                                                    <p style="margin: 0; font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Registration ID</p>
                                                    <p style="margin: 6px 0 0 0; font-size: 16px; font-weight: 600; color: #0f172a; line-height: 1.3;">${finalTeam.registrationId}</p>
                                                </td>
                                                <td style="padding: 0 0 0 8px; vertical-align: top; width: 50%; background-color: #ffffff;">
                                                    <p style="margin: 0; font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Team Size</p>
                                                    <p style="margin: 6px 0 0 0; font-size: 16px; font-weight: 600; color: #0f172a; line-height: 1.3;">${finalTeam.teamSize}</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Problem Statement Box -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 28px; background-color: #ffffff;">
                                <tr>
                                    <td style="background-color: #f0fdfa; border-left: 4px solid #14b8a6; padding: 16px 20px; border-radius: 4px;">
                                        <p style="margin: 0; font-size: 11px; color: #0f766e; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Assigned Track</p>
                                        <p style="margin: 8px 0 0 0; color: #134e4a; font-size: 14px; line-height: 1.5; font-weight: 500;">${finalTeam.problemStatement}</p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Roster Title -->
                            <h3 style="font-size: 16px; color: #0f172a; margin: 0 0 16px 0; font-weight: 700;">Team Roster</h3>
                            
                            <!-- Roster Table -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden; background-color: #ffffff;">
                                <thead>
                                    <tr style="background-color: #f8fafc;">
                                        <th style="padding: 12px 8px; font-size: 12px; font-weight: 700; text-align: left; color: #475569; border-bottom: 2px solid #e2e8f0; background-color: #f8fafc;">Role</th>
                                        <th style="padding: 12px 8px; font-size: 12px; font-weight: 700; text-align: left; color: #475569; border-bottom: 2px solid #e2e8f0; background-color: #f8fafc;">Name</th>
                                        <th style="padding: 12px 8px; font-size: 12px; font-weight: 700; text-align: left; color: #475569; border-bottom: 2px solid #e2e8f0; background-color: #f8fafc;">College</th>
                                        <th style="padding: 12px 8px; font-size: 12px; font-weight: 700; text-align: right; color: #475569; border-bottom: 2px solid #e2e8f0; background-color: #f8fafc;">ID</th>
                                    </tr>
                                </thead>
                                <tbody style="background-color: #ffffff;">
                                    ${rows}
                                </tbody>
                            </table>
                            
                            <!-- Important Notice -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 28px; background-color: #ffffff;">
                                <tr>
                                    <td style="background-color: #fef3c7; border: 1px solid #fbbf24; padding: 16px 18px; border-radius: 6px;">
                                        <p style="margin: 0; font-weight: 700; color: #92400e; font-size: 14px;">⚠️ Important Entry Instructions</p>
                                        <p style="margin: 8px 0 0 0; color: #78350f; font-size: 13px; line-height: 1.5;">
                                            Your unique QR credentials are attached. Please keep them ready on your device for check-in at the venue.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td class="footer-section" style="padding: 24px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                             <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 11px;">
                                CODE COLLOBORATE CONQUER
                            </p>
                            <p style="margin: 0; color: #64748b; font-size: 12px; line-height: 1.5;">
                                This is an automated message from the CODEFUSION Organizing Committee.
                            </p>
                        </td>
                    </tr>
                    
                </table>
                
            </td>
        </tr>
    </table>
    
</body>
</html>
  `,
        attachments,
      });

      console.log(`✅ Email sent using ${account.user}`);
      return;
    } catch (err) {
      console.error(`❌ Failed using ${account.user}, trying next...`);
    }
  }

  throw new Error("All email accounts failed");
};

/* ---------------- MAIN FUNCTION ---------------- */
const sendFinalTeamMail = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const finalTeam = await FinalTeam.findOne({
      registrationId: REGISTRATION_ID,
    });

    if (!finalTeam) {
      console.error("❌ FinalTeam not found");
      process.exit(1);
    }

    /* ---------------- ATTACH QR IMAGES ---------------- */
    const attachments = [];

    // Leader QR
    attachments.push({
      filename: `${finalTeam.leader.participantId}.png`,
      content: await fetchImageBuffer(finalTeam.leader.qrUrl),
    });

    // Member QRs
    for (const m of finalTeam.members) {
      attachments.push({
        filename: `${m.participantId}.png`,
        content: await fetchImageBuffer(m.qrUrl),
      });
    }

    await sendEmailWithFailover({
      finalTeam,
      attachments,
    });

    console.log("✅ FinalTeam email sent successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Email process failed:", err.message);
    process.exit(1);
  }
};

sendFinalTeamMail();
