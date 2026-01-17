// const FakeTeam = require("../models/FakeTeam");
const Payment = require("../models/Payment");
const Team = require("../models/Team");
const FinalTeam = require("../models/FinalTeam");
const Participant = require("../models/Participant");
const { generateQrToken } = require("../utils/generateQrToken");
const {
  uploadQrToCloudinary,
  uploadPaymentProof
} = require("../services/CloudService");
const sendQrEmail = require("../utils/sendQrEmail");
const ShortlistedTeam = require("../models/shortlistedTeams");
// count-based CFRD ID
const generateFinalTeamId = async () => {
  const count = await FinalTeam.countDocuments();
  return `CFRD${String(count + 1).padStart(2, "0")}`;
};

// const ShortlistedTeam = require("../models/shortlistedTeams");
// const FinalTeam = require("../models/FinalTeam");

exports.verifyTeamId = async (req, res) => {
  try {
    const { teamId } = req.body;

    if (!teamId) {
      return res.status(400).json({
        success: false,
        message: "Team ID is required"
      });
    }

    // 1️⃣ Check if team is shortlisted
    const shortlisted = await ShortlistedTeam.findOne({ teamId });
    if (!shortlisted) {
      return res.status(403).json({
        success: false,
        message: "Team is not shortlisted"
      });
    }

    // 2️⃣ Check if payment already submitted / team already finalized
    const alreadyFinalized = await FinalTeam.findOne({ registrationId: teamId });
    if (alreadyFinalized) {
      return res.status(409).json({
        success: false,
        message: "Payment already submitted for this team"
      });
    }

    // ✅ All checks passed
    return res.status(200).json({
      success: true,
      message: "Team verified successfully",
      team: {
        teamId: shortlisted.teamId,
        teamName: shortlisted.teamName,
        problemStatement: shortlisted.problemStatement
      }
    });

  } catch (error) {
    console.error("Verify Team Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};



exports.createPaymentAndFinalTeam = async (req, res) => {
  try {
    const {
      teamId,
      teamName,
      leaderName,
      leaderEmail,
      leaderPhone,
      leaderCollege,
      leaderTransactionId,

      member2Name,
      member2Email,
      member2Phone,
      member2College,
      member2TransactionId,

      member3Name,
      member3Email,
      member3Phone,
      member3College,
      member3TransactionId,

      member4Name,
      member4Email,
      member4Phone,
      member4College,
      member4TransactionId
    } = req.body;

    /* 1️⃣ Check shortlist */
   const shortlisted = await ShortlistedTeam.findOne({ teamId });
if (!shortlisted) {
  return res.status(403).json({
    success: false,
    message: "Team is not shortlisted"
  });
}

/* 1.1️⃣ Fetch Team (SOURCE OF TRUTH) */
const team = await Team.findOne({ registrationId: teamId });
if (!team) {
  return res.status(404).json({
    success: false,
    message: "Team not found"
  });
}

const problemStatement = team.problemStatement;



    /* 2️⃣ Generate Final Team ID */
    const finalTeamId = await generateFinalTeamId();

    /* 3️⃣ Leader */
    const leaderPid = `${finalTeamId}P1`;
    const leaderQrToken = generateQrToken(leaderPid);

    const leaderQrUrl = await uploadQrToCloudinary(
      leaderQrToken,
      teamId,
      leaderPid
    );

    const leaderPaymentProofUrl = await uploadPaymentProof(
      req.files.leaderPaymentProof[0],
      teamId,
      "leader"
    );

    const leader = {
      participantId: leaderPid,
      name: leaderName,
      email: leaderEmail,
      phone: leaderPhone,
      college: leaderCollege,
      transactionId: leaderTransactionId,
      qrToken: leaderQrToken,
      qrUrl: leaderQrUrl
    };

    const paymentParticipants = [
      {
        name: leaderName,
        transactionId: leaderTransactionId,
        paymentProofUrl: leaderPaymentProofUrl
      }
    ];

    /* 4️⃣ Members */
    const membersInput = [
      {
        name: member2Name,
        email: member2Email,
        phone: member2Phone,
        college: member2College,
        transactionId: member2TransactionId,
        fileKey: "member2PaymentProof"
      },
      {
        name: member3Name,
        email: member3Email,
        phone: member3Phone,
        college: member3College,
        transactionId: member3TransactionId,
        fileKey: "member3PaymentProof"
      },
      {
        name: member4Name,
        email: member4Email,
        phone: member4Phone,
        college: member4College,
        transactionId: member4TransactionId,
        fileKey: "member4PaymentProof"
      }
    ].filter(m => m.name);

    const members = [];

    for (let i = 0; i < membersInput.length; i++) {
      const pid = `${finalTeamId}P${i + 2}`;
      const qrToken = generateQrToken(pid);

      const qrUrl = await uploadQrToCloudinary(qrToken, teamId, pid);

      const paymentProofUrl = await uploadPaymentProof(
        req.files[membersInput[i].fileKey][0],
        teamId,
        `member${i + 2}`
      );

      members.push({
        participantId: pid,
        name: membersInput[i].name,
        email: membersInput[i].email,
        phone: membersInput[i].phone,
        college: membersInput[i].college,
        transactionId: membersInput[i].transactionId,
        qrToken,
        qrUrl
      });

      paymentParticipants.push({
        name: membersInput[i].name,
        transactionId: membersInput[i].transactionId,
        paymentProofUrl
      });
    }

    /* 5️⃣ Save Participants */
    await Participant.insertMany([
      {
        ...leader,
        finalTeamId,
        registrationId: teamId,
        role: "LEADER"
      },
      ...members.map(m => ({
        ...m,
        finalTeamId,
        registrationId: teamId,
        role: "MEMBER"
      }))
    ]);

    /* 6️⃣ Save Final Team */
    await FinalTeam.create({
      finalTeamId,
      registrationId: teamId,
      teamName,
      teamSize: members.length + 1,
      problemStatement,
      leader,
      members
    });

    /* 7️⃣ Save Payment */
    await Payment.create({
      finalTeamId,
      teamId,
      participants: paymentParticipants,
      status: "PENDING"
    });

    return res.status(201).json({
      success: true,
      message: "Payment submitted successfully",
      finalTeamId
    });

  } catch (error) {
    console.error("Payment Flow Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


exports.getAllPayments = async (req, res) => {
  try {
    /* 1️⃣ Fetch payments */
    const payments = await Payment.find()
      .sort({ createdAt: -1 })
      .lean();

    /* 2️⃣ Status counts */
    const statusCounts = await Payment.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const counts = { PENDING: 0, VERIFIED: 0, REJECTED: 0 };
    statusCounts.forEach(s => {
      counts[s._id] = s.count;
    });

    const response = [];

    for (const payment of payments) {
      /* 3️⃣ Fetch FinalTeam */
      const team = await FinalTeam.findOne({
        finalTeamId: payment.finalTeamId
      }).lean();
      if (!team) continue;

      /* 4️⃣ Build participant list with participantId */
      const allParticipants = [
        team.leader,
        ...(team.members || [])
      ];

      response.push({
        finalTeamId: payment.finalTeamId,
        registrationId: team.registrationId,
        teamName: team.teamName,
        problemStatement: team.problemStatement,
        teamSize: team.teamSize,

        participants: payment.participants.map(p => {
          const matched = allParticipants.find(
            ap => ap.name === p.name
          );

          return {
            participantId: matched?.participantId || null, // ✅ added
            name: p.name,
            transactionId: p.transactionId,
            paymentProofUrl: p.paymentProofUrl
          };
        }),

        status: payment.status,
        submittedAt: payment.createdAt
      });
    }

    return res.status(200).json({
      success: true,
      total: response.length,
      statusSummary: {
        pending: counts.PENDING,
        verified: counts.VERIFIED,
        rejected: counts.REJECTED
      },
      payments: response
    });

  } catch (error) {
    console.error("Get All Payments Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.getUnpaidTeams = async (req, res) => {
  try {
    /* 1️⃣ Get shortlisted team IDs */
    const shortlistedTeams = await ShortlistedTeam.find(
      {},
      { teamId: 1, createdAt: 1 }
    ).lean();

    /* 2️⃣ Get already paid teams */
    const finalTeams = await FinalTeam.find(
      {},
      { registrationId: 1 }
    ).lean();

    const paidTeamIds = new Set(
      finalTeams.map(t => t.registrationId)
    );

    /* 3️⃣ Filter unpaid team IDs */
    const unpaidTeamIds = shortlistedTeams.filter(
      t => !paidTeamIds.has(t.teamId)
    );

    /* 4️⃣ Fetch team details from Team collection */
    const unpaidTeams = [];

    for (const t of unpaidTeamIds) {
      const team = await Team.findOne(
        { registrationId: t.teamId },
        {
          teamName: 1,
          problemStatement: 1,
          leader: 1
        }
      ).lean();

      if (!team) continue;

      unpaidTeams.push({
        teamId: t.teamId,
        teamName: team.teamName,
        problemStatement: team.problemStatement,

        // 🔥 IMPORTANT CONTACT DETAILS
        leaderName: team.leader?.name || "N/A",
        leaderEmail: team.leader?.email || "N/A",
        leaderPhone: team.leader?.phone || "N/A",
        leaderCollege: team.leader?.college || "N/A",

        shortlistedAt: t.createdAt
      });
    }

    return res.status(200).json({
      success: true,
      total: unpaidTeams.length,
      unpaidTeams
    });

  } catch (error) {
    console.error("❌ Get Unpaid Teams Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.getAllFinalTeams = async (req, res) => {
  try {
    const finalTeams = await FinalTeam.aggregate([
      {
        // extract numeric part from "CFRD01" → 1
        $addFields: {
          teamNumber: {
            $toInt: {
              $substr: ["$finalTeamId", 4, -1]
            }
          }
        }
      },
      {
        $sort: { teamNumber: 1 } // ASCENDING
      }
    ]);

    const response = finalTeams.map(team => ({
      finalTeamId: team.finalTeamId,
      registrationId: team.registrationId,
      teamName: team.teamName,
      problemStatement: team.problemStatement,
      teamSize: team.teamSize,

      leader: {
        participantId: team.leader.participantId,
        name: team.leader.name,
        email: team.leader.email,
        phone: team.leader.phone,
        college: team.leader.college
      },

      members: (team.members || []).map(m => ({
        participantId: m.participantId,
        name: m.name,
        email: m.email,
        phone: m.phone,
        college: m.college
      })),

      createdAt: team.createdAt
    }));

    return res.status(200).json({
      success: true,
      total: response.length,
      finalTeams: response
    });

  } catch (error) {
    console.error("❌ Get All Final Teams Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
