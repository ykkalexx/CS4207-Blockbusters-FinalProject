console.log("Loading app.js");
console.log("tst");

let web3;
let studentRegistry;
let cvShare;
let interviewShare;
let currentAccount;

const studentRegistryAddress = "0x92A160825D89C0F5BA3F7F08A9357069E34d4406";
const cvShareAddress = "0x2ED665145A1cFB3996d14005fBcB63e416990130";
const interviewShareAddress = "0x3366084ED3e7AE27AEe838c3bF91Ca444Cf36BFe";
const mentorshipProgramAddress = "0x08Ac38B9E2594aAc780Dba9f7d7c26761558c226";

const StudentRegistryABI = [
  {
    inputs: [],
    stateMutability: "payable",
    type: "constructor",
    payable: true,
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "studentAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "studentId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
    ],
    name: "StudentRegistered",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_studentAddress",
        type: "address",
      },
    ],
    name: "getStudentInfo",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "studentId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "yearOfStudy",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_studentId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_yearOfStudy",
        type: "uint256",
      },
    ],
    name: "registerStudent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const CVShareABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_studentRegistry",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "student",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "ipfsHash",
        type: "string",
      },
    ],
    name: "CVShared",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "studentCVs",
    outputs: [
      {
        internalType: "string",
        name: "ipfsHash",
        type: "string",
      },
      {
        internalType: "bool",
        name: "isPublic",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "studentRegistry",
    outputs: [
      {
        internalType: "contract StudentRegistry",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_ipfsHash",
        type: "string",
      },
      {
        internalType: "bool",
        name: "_isPublic",
        type: "bool",
      },
    ],
    name: "shareCV",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const InterviewShareABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_studentRegistry",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sharer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "companyName",
        type: "string",
      },
    ],
    name: "InterviewShared",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "companyInterviews",
    outputs: [
      {
        internalType: "string",
        name: "companyName",
        type: "string",
      },
      {
        internalType: "string",
        name: "position",
        type: "string",
      },
      {
        internalType: "string[]",
        name: "questions",
        type: "string[]",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "sharedBy",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_companyName",
        type: "string",
      },
      {
        internalType: "string[]",
        name: "_questions",
        type: "string[]",
      },
      {
        internalType: "string",
        name: "_position",
        type: "string",
      },
    ],
    name: "shareInterview",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const MentorshipProgramABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_studentRegistry",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "mentor",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "mentee",
        type: "address",
      },
    ],
    name: "MenteeAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "mentor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "subject",
        type: "string",
      },
    ],
    name: "MentorRegistered",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "menteeToMentor",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "mentors",
    outputs: [
      {
        internalType: "address",
        name: "mentorAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "subject",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "studentRegistry",
    outputs: [
      {
        internalType: "contract IStudentRegistry",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string[]",
        name: "_skills",
        type: "string[]",
      },
      {
        internalType: "string",
        name: "_subject",
        type: "string",
      },
    ],
    name: "registerAsMentor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_mentee",
        type: "address",
      },
    ],
    name: "addMentee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_mentor",
        type: "address",
      },
    ],
    name: "getMentorDetails",
    outputs: [
      {
        internalType: "address",
        name: "mentorAddress",
        type: "address",
      },
      {
        internalType: "string[]",
        name: "skills",
        type: "string[]",
      },
      {
        internalType: "string",
        name: "subject",
        type: "string",
      },
      {
        internalType: "address[]",
        name: "mentees",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

function isValidAddress(address) {
  return web3.utils.isAddress(address);
}

async function init() {
  if (typeof window.ethereum === "undefined") {
    alert("Please install MetaMask!");
    return;
  }

  try {
    // Request account access
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // Create Web3 instance
    web3 = new Web3(window.ethereum);

    // Get current account
    const accounts = await web3.eth.getAccounts();
    currentAccount = accounts[0];

    // Get current network
    const networkId = await web3.eth.net.getId();
    console.log("Network ID:", networkId);

    // Initialize contracts
    studentRegistry = new web3.eth.Contract(
      StudentRegistryABI,
      web3.utils.toChecksumAddress(studentRegistryAddress)
    );

    cvShare = new web3.eth.Contract(
      CVShareABI,
      web3.utils.toChecksumAddress(cvShareAddress)
    );

    interviewShare = new web3.eth.Contract(
      InterviewShareABI,
      web3.utils.toChecksumAddress(interviewShareAddress)
    );

    mentorshipProgram = new web3.eth.Contract(
      MentorshipProgramABI,
      web3.utils.toChecksumAddress(mentorshipProgramAddress)
    );

    console.log("Initialization complete");

    // Check user's year and show appropriate mentorship section
    const userInfo = await studentRegistry.methods
      .getStudentInfo(currentAccount)
      .call();
    const yearOfStudy = parseInt(userInfo.yearOfStudy);

    if (yearOfStudy === 4) {
      document.getElementById("mentor-registration").style.display = "block";
    } else if (yearOfStudy >= 1 && yearOfStudy <= 3) {
      document.getElementById("mentee-section").style.display = "block";
      loadMentors();
    }
  } catch (error) {
    console.error("Detailed error:", error);
    alert("Failed to initialize Web3: " + error.message);
  }
}

window.addEventListener("load", init);

async function registerStudent() {
  try {
    if (!studentRegistry || !currentAccount) {
      throw new Error("Contract or account not initialized");
    }

    const name = document.getElementById("studentName").value;
    const id = parseInt(document.getElementById("studentId").value);
    const year = parseInt(document.getElementById("yearOfStudy").value);

    // Input validation
    if (!name || isNaN(id) || isNaN(year)) {
      throw new Error("Invalid input values");
    }

    const tx = await studentRegistry.methods
      .registerStudent(name, id, year)
      .send({
        from: currentAccount,
        gas: 300000, // Specify gas limit
      });

    console.log("Transaction:", tx);
    alert("Student registered successfully!");
  } catch (error) {
    console.error("Registration error:", error);
    alert("Failed to register: " + error.message);
  }
}

async function shareCV() {
  try {
    const ipfsHash = document.getElementById("ipfsHash").value;
    const isPublic = document.getElementById("isPublic").checked;

    await cvShare.methods
      .shareCV(ipfsHash, isPublic)
      .send({ from: currentAccount });
    alert("CV shared successfully!");
  } catch (error) {
    alert("Error sharing CV: " + error.message);
  }
}

async function shareInterview() {
  try {
    const companyName = document.getElementById("companyName").value;
    const position = document.getElementById("position").value;
    const questions = document
      .getElementById("questions")
      .value.split(",")
      .map((q) => q.trim());

    await interviewShare.methods
      .shareInterview(companyName, questions, position)
      .send({ from: currentAccount });
    alert("Interview experience shared successfully!");
  } catch (error) {
    alert("Error sharing interview: " + error.message);
  }
}

async function loadSharedCVs() {
  try {
    const currentUserInfo = await studentRegistry.methods
      .getStudentInfo(currentAccount)
      .call();
    const yearOfStudy = parseInt(currentUserInfo.yearOfStudy);
    if (yearOfStudy < 1 || yearOfStudy > 3) {
      alert("Only students in years 1-3 can view shared CVs");
      return;
    }

    const cvList = document.getElementById("cv-list");
    cvList.innerHTML = "<h3>Loading CVs...</h3>";

    const totalStudents = await studentRegistry.methods.totalStudents().call();
    const cvs = [];

    for (let i = 0; i < totalStudents; i++) {
      const studentAddress = await studentRegistry.methods
        .studentIdToAddress(i)
        .call();
      const cv = await cvShare.methods.studentCVs(studentAddress).call();

      if (cv.isPublic && cv.ipfsHash) {
        cvs.push({
          owner: cv.owner,
          ipfsHash: cv.ipfsHash,
          timestamp: new Date(cv.timestamp * 1000).toLocaleDateString(),
        });
      }
    }

    cvList.innerHTML =
      cvs.length === 0
        ? "<p>No public CVs found</p>"
        : cvs
            .map(
              (cv) => `
        <div class="cv-item">
          <p><strong>Owner:</strong> ${cv.owner}</p>
          <p><strong>IPFS Hash:</strong> ${cv.ipfsHash}</p>
          <p><strong>Shared on:</strong> ${cv.timestamp}</p>
          <button onclick="viewIPFSContent('${cv.ipfsHash}')">View CV</button>
        </div>
      `
            )
            .join("");
  } catch (error) {
    console.error("Error loading CVs:", error);
    document.getElementById("cv-list").innerHTML =
      "<p>Error loading CVs. Please try again.</p>";
  }
}

async function showAllInterviews() {
  try {
    const currentUserInfo = await studentRegistry.methods
      .getStudentInfo(currentAccount)
      .call();
    const yearOfStudy = parseInt(currentUserInfo.yearOfStudy);
    if (yearOfStudy < 1 || yearOfStudy > 3) {
      alert("Only students in years 1-3 can view interview experiences");
      return;
    }

    const interviewList = document.getElementById("interview-list");
    interviewList.innerHTML = "<h3>Loading interviews...</h3>";

    const events = await interviewShare.getPastEvents("InterviewShared", {
      fromBlock: 0,
      toBlock: "latest",
    });

    const interviews = [];
    for (const event of events) {
      const interview = {
        sharedBy: event.returnValues.sharer,
        companyName: event.returnValues.companyName,
        blockNumber: event.blockNumber,
        timestamp: (await web3.eth.getBlock(event.blockNumber)).timestamp,
      };
      interviews.push(interview);
    }

    if (interviews.length === 0) {
      interviewList.innerHTML = "<p>No interviews found</p>";
      return;
    }

    interviewList.innerHTML = interviews
      .map(
        (interview) => `
      <div class="interview-item">
        <h3>${interview.companyName}</h3>
        <p><strong>Shared by:</strong> ${interview.sharedBy}</p>
        <p><strong>Date:</strong> ${new Date(
          interview.timestamp * 1000
        ).toLocaleDateString()}</p>
      </div>
    `
      )
      .join("");
  } catch (error) {
    console.error("Error:", error);
    interviewList.innerHTML =
      "<p>Error loading interviews. Please try again.</p>";
  }
}

async function viewIPFSContent(ipfsHash) {
  window.open(`https://ipfs.io/ipfs/${ipfsHash}`, "_blank");
}

async function checkStudentStatus() {
  try {
    const info = await studentRegistry.methods
      .getStudentInfo(currentAccount)
      .call();
    console.log("Student registration status:", {
      address: currentAccount,
      name: info.name,
      studentId: info.studentId.toString(),
      yearOfStudy: info.yearOfStudy.toString(),
    });
    return info;
  } catch (error) {
    console.error("Error checking student status:", error);
    throw error;
  }
}

async function registerAsMentor() {
  try {
    // First verify student status
    const studentInfo = await checkStudentStatus();

    const skills = document
      .getElementById("mentor-skills")
      .value.split(",")
      .map((s) => s.trim());
    const subject = document.getElementById("mentor-subject").value;

    // Let's check if the contract method exists and is callable
    console.log("Contract ABI:", mentorshipProgram.methods);
    console.log("Calling method:", {
      methodName: "registerAsMentor",
      parameters: [skills, subject],
    });

    // Let's try to encode the function call to verify parameters
    const encodedCall = mentorshipProgram.methods
      .registerAsMentor(skills, subject)
      .encodeABI();
    console.log("Encoded call:", encodedCall);

    // Try to get gas estimate first
    try {
      const gasEstimate = await mentorshipProgram.methods
        .registerAsMentor(skills, subject)
        .estimateGas({ from: currentAccount });
      console.log("Gas estimate successful:", gasEstimate);
    } catch (gasError) {
      console.error("Gas estimation failed:", gasError);
      // Try with hardcoded gas limit if estimation fails
      console.log("Attempting transaction with fixed gas limit...");
    }

    // Add the actual transaction
    const tx = await mentorshipProgram.methods
      .registerAsMentor(skills, subject)
      .send({
        from: currentAccount,
        gas: 500000, // Increased gas limit
      });

    console.log("Transaction successful:", tx);
    alert("Successfully registered as mentor!");
  } catch (error) {
    if (error.message.includes("revert")) {
      // Parse the revert reason if available
      const revertReason = error.message.match(/revert\s(.+?)"/);
      if (revertReason && revertReason[1]) {
        console.error("Contract reverted with reason:", revertReason[1]);
      }
    }
    console.error("Full error:", error);
    alert("Failed to register as mentor: " + error.message);
  }
}

async function loadMentors() {
  try {
    const mentorList = document.getElementById("mentor-list");
    mentorList.innerHTML = "<p>Loading mentors...</p>";

    // Get past events for mentor registration
    const events = await mentorshipProgram.getPastEvents("MentorRegistered", {
      fromBlock: 0,
      toBlock: "latest",
    });

    if (events.length === 0) {
      mentorList.innerHTML = "<p>No mentors available</p>";
      return;
    }

    let mentorsHtml = "";
    for (const event of events) {
      const mentorAddress = event.returnValues.mentor;
      const details = await mentorshipProgram.methods
        .getMentorDetails(mentorAddress)
        .call();

      mentorsHtml += `
        <div class="mentor-item">
          <h4>Mentor: ${mentorAddress}</h4>
          <p><strong>Subject:</strong> ${details.subject}</p>
          <p><strong>Skills:</strong> ${details.skills.join(", ")}</p>
          <p><strong>Current Mentees:</strong> ${details.mentees.length}</p>
          <button onclick="joinMentor('${mentorAddress}')">Join This Mentor</button>
        </div>
      `;
    }

    mentorList.innerHTML = mentorsHtml;
  } catch (error) {
    console.error("Error loading mentors:", error);
    mentorList.innerHTML = "<p>Error loading mentors. Please try again.</p>";
  }
}

async function joinMentor(mentorAddress) {
  try {
    await mentorshipProgram.methods.addMentee(currentAccount).send({
      from: currentAccount,
      gas: 300000,
    });
    alert("Successfully joined mentor group!");
    loadMentors();
  } catch (error) {
    console.error("Error joining mentor:", error);
    alert("Failed to join mentor: " + error.message);
  }
}

window.addEventListener("load", init);
