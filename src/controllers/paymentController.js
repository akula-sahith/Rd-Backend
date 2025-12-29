const FakeTeam = require("../models/FakeTeam");
const Payment = require("../models/Payment");
const FinalTeam = require("../models/FinalTeam");
const Participant = require("../models/Participant");
const { generateQrToken } = require("../utils/generateQrToken");
// const generateQrImage = require("../utils/generateQrImage");
const sendQrEmail = require("../utils/sendQrEmail");

// count-based CFRD ID
const generateFinalTeamId = async () => {
  const count = await FinalTeam.countDocuments();
  return `CFRD${String(count + 1).padStart(2, "0")}`;
};

exports.createPaymentAndFinalTeam = async (req, res) => {
  try {
    const {
      fakeRegistrationId,
      finalLeaderName,
      finalMembers,
      paymentId,
      amount
    } = req.body;

    // 1️⃣ Validation
    if (!fakeRegistrationId || !finalLeaderName || !paymentId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment data"
      });
    }

    // 2️⃣ Fetch FakeTeam
    const team = await FakeTeam.findOne({ fakeRegistrationId });
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Invalid registration ID"
      });
    }

    // 3️⃣ Generate Final Team ID
    const finalTeamId = await generateFinalTeamId();

    // 4️⃣ Save Payment
    await Payment.create({
      registrationId: fakeRegistrationId,
      finalTeamId,
      finalLeaderName,
      finalMembers,
      paymentId,
      amount,
      status: "SUCCESS"
    });

    // 5️⃣ Create FinalTeam
    await FinalTeam.create({
      finalTeamId,
      registrationId: fakeRegistrationId,
      teamName: team.teamName,
      teamSize: team.teamSize,
      problemStatement: team.problemStatement,
      leader: {
        name: finalLeaderName,
        email: team.leader.email,
        phone: team.leader.phone,
        college: team.leader.college,
        department: team.leader.department,
        year: team.leader.year
      },
      members: finalMembers.map((m) => ({ name: m.name })),
      payment: {
        paymentId,
        amount,
        paidAt: new Date()
      }
    });

    // 6️⃣ CREATE PARTICIPANTS + QR TOKENS + QR IMAGES

const participants = [];

// 🔹 LEADER (P1)
const leaderId = `${finalTeamId}P1`;
const leaderToken = generateQrToken(leaderId);

// 🔥 THIS WAS MISSING
// await generateQrImage(leaderToken, leaderId);

participants.push({
  participantId: leaderId,
  finalTeamId,
  registrationId: fakeRegistrationId,
  name: finalLeaderName,
  role: "LEADER",
  qrToken: leaderToken
});

// 🔹 MEMBERS (P2, P3, P4)
for (let i = 0; i < finalMembers.length; i++) {
  const pid = `${finalTeamId}P${i + 2}`;
  const token = generateQrToken(pid);

  // 🔥 THIS WAS MISSING
  // await generateQrImage(token, pid);

  participants.push({
    participantId: pid,
    finalTeamId,
    registrationId: fakeRegistrationId,
    name: finalMembers[i].name,
    role: "MEMBER",
    qrToken: token
  });
}

// 🔹 Save participants ONLY after QRs exist
await Participant.insertMany(participants);

    
   const createdParticipants = await Participant.find({ finalTeamId });

await sendQrEmail({
  toEmail: team.leader.email,
  toName: finalLeaderName,
  finalTeamId,
  teamName: team.teamName,
  participants: createdParticipants
});


    // 7️⃣ Response
    return res.status(201).json({
      success: true,
      message: "Payment, FinalTeam, Participants & QR tokens created",
      finalTeamId,
      participantsCreated: participants.length
    });

  } catch (error) {
    console.error("Payment Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
