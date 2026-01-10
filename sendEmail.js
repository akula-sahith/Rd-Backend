import mongoose from "mongoose";
import dotenv from "dotenv";
import ShortlistedTeam from "./src/models/ShortListedTeams.js";
import Team from "./src/models/Team.js";
import nodemailer from "nodemailer";

dotenv.config();

/* ---------------- EMAIL ACCOUNTS POOL ---------------- */
const emailAccounts = [
  { user: process.env.EMAIL_USER1, pass: process.env.EMAIL_PASS1 },
  { user: process.env.EMAIL_USER2, pass: process.env.EMAIL_PASS2 },
  { user: process.env.EMAIL_USER3, pass: process.env.EMAIL_PASS3 },
  { user: process.env.EMAIL_USER4, pass: process.env.EMAIL_PASS4 },
  { user: process.env.EMAIL_USER5, pass: process.env.EMAIL_PASS5 },
];

/* ---------------- SEND WITH FAILOVER ---------------- */
const sendEmailWithFailover = async ({ teamName, leaderEmail }) => {
  for (let i = 0; i < emailAccounts.length; i++) {
    const account = emailAccounts[i];
    if (!account.user || !account.pass) continue;

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      await transporter.sendMail({
        from: account.user,
        to: leaderEmail,
        subject: "🎉 Shortlisted for CODEFUSION – Research Conclave 2026",
        html: `
         <div style="font-family:Arial; line-height:1.6">
  <h2>🎉 Congratulations Team ${teamName}!</h2>

  <p>
    Your team has been <b>shortlisted</b> for
    <b>CODEFUSION – 24 Hour National Level Hackathon</b>,
    part of <b>Research Conclave 2026</b>.
  </p>

  <p><b>🗓 Date:</b> 23 Jan 2026 (11:00 AM) – 24 Jan 2026 (11:00 AM)</p>
  <p><b>🏆 Prizes:</b> ₹50,000 worth</p>
  <p><b>📜 Certificates & Food:</b> Provided</p>

  <p>
    Organized by <b>R&amp;D Cell, IT &amp; CSE</b><br/>
    Siddhartha Academy of Higher Education (Deemed University)
  </p>

  <hr/>

  <p>
    📢 <b>Join the Official WhatsApp Group for Updates:</b><br/>
    <a 
      href="https://chat.whatsapp.com/GQZyPpBUAJNKpYYBdyFcSi"
      target="_blank"
      style="color:#2563eb; font-weight:bold; text-decoration:none;"
    >
      👉 Click here to join the CODEFUSION WhatsApp Group
    </a>
  </p>

  <p>
    Further instructions regarding reporting time, venue, and event
    guidelines will be shared via the WhatsApp group and email.
  </p>

  <p>
    Regards,<br/>
    <b>Team CODEFUSION</b>
  </p>
</div>

        `,
      });

      console.log(`✅ Email sent to ${leaderEmail} using ${account.user}`);
      return; // ✅ STOP after success
    } catch (err) {
      console.error(`❌ Failed using ${account.user}, switching account...`);
    }
  }

  throw new Error("All email accounts failed");
};

/* ---------------- MAIN FUNCTION ---------------- */
const sendEmailsToShortlistedTeams = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const shortlistedTeams = await ShortlistedTeam.find({});

    for (const shortlisted of shortlistedTeams) {
      const team = await Team.findOne({
        registrationId: shortlisted.teamId,
      });

      if (!team?.leader?.email) {
        console.log(`⚠️ Email not found for teamId ${shortlisted.teamId}`);
        continue;
      }

      await sendEmailWithFailover({
        teamName: shortlisted.teamName,
        leaderEmail: team.leader.email,
      });
    }

    console.log("✅ All emails processed");
    process.exit(0);
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
    process.exit(1);
  }
};

sendEmailsToShortlistedTeams();
