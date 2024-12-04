console.log("Loading app.js");
console.log("tst");

let web3;
let studentRegistry;
let cvShare;
let interviewShare;
let currentAccount;

const studentRegistryAddress = "0xD1498a074f3cDDfF0b834A1750286D3BDf37C084";
const cvShareAddress = "0x8ae4F7a64633e53210Eebb52b73Cb96431BC4741";
const interviewShareAddress = "0x585CE2c1D3ED4575EE03a39F45D77AcEA4314456";

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

    console.log("Initialization complete");
  } catch (error) {
    console.error("Detailed error:", error);
    alert("Failed to initialize Web3: " + error.message);
  }
}

// Remove any detectEthereumProvider usage since we're using window.ethereum directly
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

async function searchInterviews() {
  try {
    const currentUserInfo = await studentRegistry.methods
      .getStudentInfo(currentAccount)
      .call();
    const yearOfStudy = parseInt(currentUserInfo.yearOfStudy);
    if (yearOfStudy < 1 || yearOfStudy > 3) {
      alert("Only students in years 1-3 can view interview experiences");
      return;
    }

    const companyName = document.getElementById("searchCompany").value;
    if (!companyName) {
      alert("Please enter a company name");
      return;
    }

    const interviewList = document.getElementById("interview-list");
    interviewList.innerHTML = "<h3>Loading interviews...</h3>";

    const interviews = await interviewShare.methods
      .companyInterviews(companyName, 0)
      .call();

    if (!interviews || !interviews.length) {
      interviewList.innerHTML = "<p>No interviews found for this company</p>";
      return;
    }

    interviewList.innerHTML = `
      <div class="interview-item">
        <h3>${interviews.companyName}</h3>
        <p><strong>Position:</strong> ${interviews.position}</p>
        <p><strong>Questions:</strong></p>
        <ul>
          ${interviews.questions.map((q) => `<li>${q}</li>`).join("")}
        </ul>
        <p><strong>Shared by:</strong> ${interviews.sharedBy}</p>
        <p><strong>Date:</strong> ${new Date(
          interviews.timestamp * 1000
        ).toLocaleDateString()}</p>
      </div>
    `;
  } catch (error) {
    console.error("Error searching interviews:", error);
    document.getElementById("interview-list").innerHTML =
      "<p>Error loading interviews. Please try again.</p>";
  }
}

async function viewIPFSContent(ipfsHash) {
  window.open(`https://ipfs.io/ipfs/${ipfsHash}`, "_blank");
}

window.addEventListener("load", init);
