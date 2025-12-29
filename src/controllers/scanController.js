const Participant = require("../models/Participant");
const verifyQrToken = require("../utils/verifyQrToken");

const SCAN_FIELD_MAP = {
  ATTENDANCE: "attendance",
  BREAKFAST: "breakfast",
  LUNCH: "lunch",
  DINNER: "dinner",
  SNACKS: "snacks"
};

exports.verifyQrScan = async (req, res) => {
  try {
    const { qrToken, scanType } = req.body;

    // 1️⃣ Validate request
    if (!qrToken || !scanType) {
      return res.status(400).json({
        success: false,
        message: "qrToken and scanType are required"
      });
    }

    if (!SCAN_FIELD_MAP[scanType]) {
      return res.status(400).json({
        success: false,
        message: "Invalid scan type"
      });
    }

    // 2️⃣ Verify QR token
    const decoded = verifyQrToken(qrToken);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired QR"
      });
    }

    const { participantId } = decoded;

    // 3️⃣ Find participant
    const participant = await Participant.findOne({ participantId });
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "Participant not found"
      });
    }

    const field = SCAN_FIELD_MAP[scanType];

    // 4️⃣ Prevent duplicate scan
    if (participant[field]) {
      return res.status(409).json({
        success: false,
        message: `${scanType} already marked`,
        participantId: participant.participantId,
        name: participant.name
      });
    }

    // 5️⃣ Mark scan
    participant[field] = true;
    await participant.save();

    // 6️⃣ Success response
    return res.status(200).json({
      success: true,
      message: `${scanType} marked successfully`,
      participantId: participant.participantId,
      name: participant.name,
      finalTeamId: participant.finalTeamId
    });

  } catch (error) {
    console.error("QR Verification Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
