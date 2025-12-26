const Team = require("../models/Team");
const Counter = require("../models/Counter");
const sendRegistrationEmail = require("../utils/sendEmail");

exports.registerTeam = async (req, res) => {
  try {
    const data = req.body;

    // Prevent duplicate team name
    const existingTeam = await Team.findOne({ teamName: data.teamName });
    if (existingTeam) {
      return res.status(409).json({
        message: "Team name already registered",
      });
    }

    // Generate Registration ID
    const counter = await Counter.findOneAndUpdate(
      { name: "registrationId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const registrationId =
      counter.seq < 10
        ? `RD0${counter.seq}`
        : `RD${counter.seq}`;

    // Save team
    const team = await Team.create({
      registrationId,

      teamName: data.teamName,
      teamSize: data.teamSize,
      problemStatement: data.problemStatement,

      leader: {
        name: data.leaderName,
        email: data.leaderEmail,
        phone: data.leaderPhone,
        college: data.leaderCollege,
        department: data.leaderDepartment,
        year: data.leaderYear,
      },

      members: {
        member2: {
          name: data.member2Name,
          email: data.member2Email,
          phone: data.member2Phone,
        },
        member3: {
          name: data.member3Name,
          email: data.member3Email,
          phone: data.member3Phone,
        },
        member4:
          data.teamSize === "4"
            ? {
                name: data.member4Name,
                email: data.member4Email,
                phone: data.member4Phone,
              }
            : undefined,
      },
    });

    // 📧 Send confirmation email (NON-BLOCKING)
    sendRegistrationEmail({
  toEmail: data.leaderEmail,
  toName: data.leaderName,
  registrationId,
  teamName: data.teamName,
  teamSize: data.teamSize,
  members: [
    data.leaderName,
    data.member2Name,
    data.member3Name,
    ...(data.teamSize === "4" ? [data.member4Name] : [])
  ]
});


    // Response
    res.status(201).json({
      success: true,
      message: "Team Registered Successfully",
      registrationId,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
