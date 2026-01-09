// const FakeTeam = require("../models/FakeTeam");
const Payment = require("../models/Payment");
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

exports.createPaymentAndFinalTeam = async (req, res) => {
  try {
    const {
      teamId,
      teamName,
      problemStatement,

      leaderName,
      leaderEmail,
      leaderPhone,
      leaderCollege,

      member2Name,
      member2Email,
      member2Phone,
      member2College,

      member3Name,
      member3Email,
      member3Phone,
      member3College,

      member4Name,
      member4Email,
      member4Phone,
      member4College,

      paymentId,
      amount
    } = req.body;

    /* ------------------------------------ */
    /* 1️⃣ Check if team is shortlisted       */
    /* ------------------------------------ */
    const shortlisted = await ShortlistedTeam.findOne({ teamId });
    if (!shortlisted) {
      return res.status(403).json({
        success: false,
        message: "Team is not shortlisted"
      });
    }

    /* ------------------------------------ */
    /* 2️⃣ Generate Final Team ID             */
    /* ------------------------------------ */
    const finalTeamId = await generateFinalTeamId();

    /* ------------------------------------ */
    /* 3️⃣ Process Leader                    */
    /* ------------------------------------ */
    const leaderPid = `${finalTeamId}P1`;
    const leaderQrToken = generateQrToken(leaderPid);

    const leaderQrUrl = await uploadQrToCloudinary(
      leaderQrToken,
      teamName,
      leaderPid
    );

    const leaderPaymentUrl = await uploadPaymentProof(
      req.files.leaderPaymentProof[0],
      teamName
    );

    const leader = {
      participantId: leaderPid,
      name: leaderName,
      email: leaderEmail,
      phone: leaderPhone,
      college: leaderCollege,
      qrToken: leaderQrToken,
      qrUrl: leaderQrUrl
    };

    /* ------------------------------------ */
    /* 4️⃣ Process Members                  */
    /* ------------------------------------ */
    const membersInput = [
      {
        name: member2Name,
        email: member2Email,
        phone: member2Phone,
        college: member2College,
        fileKey: "member2PaymentProof"
      },
      {
        name: member3Name,
        email: member3Email,
        phone: member3Phone,
        college: member3College,
        fileKey: "member3PaymentProof"
      },
      {
        name: member4Name,
        email: member4Email,
        phone: member4Phone,
        college: member4College,
        fileKey: "member4PaymentProof"
      }
    ].filter(m => m.name); // remove empty members

    const members = [];

    for (let i = 0; i < membersInput.length; i++) {
      const pid = `${finalTeamId}P${i + 2}`;
      const qrToken = generateQrToken(pid);

      const qrUrl = await uploadQrToCloudinary(qrToken, teamName, pid);
      await uploadPaymentProof(req.files[membersInput[i].fileKey][0], teamName);

      members.push({
        participantId: pid,
        name: membersInput[i].name,
        email: membersInput[i].email,
        phone: membersInput[i].phone,
        college: membersInput[i].college,
        qrToken,
        qrUrl
      });
    }

    /* ------------------------------------ */
    /* 5️⃣ Save Participants Collection     */
    /* ------------------------------------ */
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

    /* ------------------------------------ */
    /* 6️⃣ Save Final Team                  */
    /* ------------------------------------ */
    await FinalTeam.create({
      finalTeamId,
      registrationId: teamId,
      teamName,
      teamSize: members.length + 1,
      problemStatement,
      leader,
      members,
      payment: {
        paymentId,
        amount,
        paidAt: new Date(),
        status: "PENDING"
      }
    });

    /* ------------------------------------ */
    /* 7️⃣ Save Payment Record              */
    /* ------------------------------------ */
    await Payment.create({
      finalTeamId,
      teamId,
      status: "PENDING"
    });

    return res.status(201).json({
      success: true,
      message: "Payment submitted successfully",
      finalTeamId
    });

  } catch (error) {
    console.error("Payment Flow Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
