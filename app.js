console.log("Loading app.js");

let web3;
console.log("Web3 initialized:", web3);
let studentRegistry;
let cvShare;
let interviewShare;
let peerNetwork;
let currentAccount;
let mentorshipProgram;

const studentRegistryAddress = "0xF225E490651C795F9C8F9a6846aE0E789879fB83";
const cvShareAddress = "0x8B155776FcB9BA0aD0d116701d914f7369c7f5f2";
const interviewShareAddress = "0xA628E932AF349915c606A70585e8Fc79f10cC566";
const peerNetworkAddress = "0xd40825688C40288b9f78d865114c563C59A468A8";
const mentorshipNetworkAddress = "0x9Df68981BdCe20Ede4BA892480788F1DEB2F919f";

const PeerNetworkABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "company",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "ipfsHash",
        type: "string",
      },
    ],
    name: "CVLinkedToCompany",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "company",
        type: "string",
      },
    ],
    name: "CompanyAdded",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_company",
        type: "string",
      },
    ],
    name: "addCompany",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getCompanies",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_company",
        type: "string",
      },
      {
        internalType: "string",
        name: "_ipfsHash",
        type: "string",
      },
    ],
    name: "linkCVToCompany",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_company",
        type: "string",
      },
    ],
    name: "getCVsForCompany",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const StudentRegistryABI = [
  {
    inputs: [],
    stateMutability: "payable",
    type: "constructor",
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
    inputs: [],
    name: "owner",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "studentIdToAddress",
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
    name: "students",
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
      {
        internalType: "bool",
        name: "isRegistered",
        type: "bool",
      },
      {
        internalType: "address",
        name: "studentAddress",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalStudents",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
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

async function waitForEthereum(maxRetries = 10) {
  let retries = 0;
  while (retries < maxRetries) {
    if (window.ethereum) return true;
    console.log(`Waiting for Ethereum... Attempt ${retries + 1}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    retries++;
  }
  return false;
}

async function init() {
  try {
    const hasEthereum = await waitForEthereum();
    if (!hasEthereum) {
      throw new Error("MetaMask not detected after retries");
    }

    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    currentAccount = accounts[0];
    console.log("Connected:", currentAccount);

    // Initialize contracts
    studentRegistry = new web3.eth.Contract(
      StudentRegistryABI,
      studentRegistryAddress
    );
    cvShare = new web3.eth.Contract(CVShareABI, cvShareAddress);
    interviewShare = new web3.eth.Contract(
      InterviewShareABI,
      interviewShareAddress
    );
    peerNetwork = new web3.eth.Contract(PeerNetworkABI, peerNetworkAddress);
    mentorshipProgram = new web3.eth.Contract(
      MentorshipProgramABI,
      mentorshipProgramAddress
    );

    // Set up event listeners for contract events
    setupEventListeners();
  } catch (error) {
    console.error("Initialization failed:", error);
  }
}

function setupEventListeners() {
  studentRegistry.events
    .StudentRegistered()
    .on("data", (event) => {
      console.log("New student registered:", event.returnValues);
      refreshStudentInfo();
    })
    .on("error", console.error);

  cvShare.events
    .CVShared()
    .on("data", (event) => {
      console.log("New CV shared:", event.returnValues);
      refreshCVList();
    })
    .on("error", console.error);

  interviewShare.events
    .InterviewShared()
    .on("data", (event) => {
      console.log("New interview shared:", event.returnValues);
      refreshInterviews();
    })
    .on("error", console.error);
}

window.addEventListener("load", init);

async function registerStudent() {
  try {
    const name = document.getElementById("studentName").value;
    const id = parseInt(document.getElementById("studentId").value);
    const year = parseInt(document.getElementById("yearOfStudy").value);

    if (!name || !id || !year) {
      throw new Error("All fields are required");
    }

    if (year < 1 || year > 4) {
      throw new Error("Year of study must be between 1 and 4");
    }

    await studentRegistry.methods
      .registerStudent(name, id, year)
      .send({ from: currentAccount });

    alert("Student registered successfully!");
    refreshStudentInfo();
  } catch (error) {
    alert("Error registering student: " + error.message);
  }
}

async function shareCV() {
  try {
    const ipfsHash = document.getElementById("ipfsHash").value;
    const isPublic = document.getElementById("isPublic").checked;

    if (!ipfsHash) {
      throw new Error("IPFS hash is required");
    }

    await cvShare.methods
      .shareCV(ipfsHash, isPublic)
      .send({ from: currentAccount });

    alert("CV shared successfully!");
    refreshCVList();
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
      .map((q) => q.trim())
      .filter((q) => q.length > 0);

    if (!companyName || !position || questions.length === 0) {
      throw new Error(
        "All fields are required and at least one question must be provided"
      );
    }

    await interviewShare.methods
      .shareInterview(companyName, questions, position)
      .send({ from: currentAccount });

    alert("Interview experience shared successfully!");
    refreshInterviews();
  } catch (error) {
    alert("Error sharing interview: " + error.message);
  }
}

async function addCompany() {
  try {
    const company = document.getElementById("addCompany").value;

    if (!company) {
      throw new Error("Company name is required");
    }

    await peerNetwork.methods
      .addCompany(company)
      .send({ from: currentAccount });

    alert(`Company ${company} added successfully!`);
    refreshCompanies();
  } catch (error) {
    alert("Error adding company: " + error.message);
  }
}

async function refreshCompanies() {
  try {
    const companies = await peerNetwork.methods.getCompanies().call();
    const companyList = document.getElementById("companyList");
    companyList.innerHTML = companies
      .map((company) => `<li>${company}</li>`)
      .join("");
  } catch (error) {
    console.error("Error fetching companies:", error);
  }
}

async function registerAsMentor() {
  try {
    const skills = document
      .getElementById("mentorSkills")
      .value.split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const subject = document.getElementById("mentorSubject").value;

    if (!subject || skills.length === 0) {
      throw new Error("Subject and at least one skill are required");
    }

    await mentorshipProgram.methods
      .registerAsMentor(skills, subject)
      .send({ from: currentAccount });

    alert("Registered as mentor successfully!");
    refreshMentors();
  } catch (error) {
    alert("Error registering as mentor: " + error.message);
  }
}

async function addMentee() {
  try {
    const menteeAddress = document.getElementById("menteeAddress").value;
    const paymentAmount = web3.utils.toWei(
      document.getElementById("paymentAmount").value,
      "ether"
    );

    if (!web3.utils.isAddress(menteeAddress)) {
      throw new Error("Invalid mentee address");
    }

    await mentorshipProgram.methods
      .addMentee(menteeAddress)
      .send({ from: currentAccount, value: paymentAmount });

    alert("Mentee added successfully!");
    refreshMentors();
  } catch (error) {
    alert("Error adding mentee: " + error.message);
  }
}

async function refreshInterviews() {
  try {
    const interviews = await interviewShare.methods.getAllInterviews().call();
    const interviewList = document.getElementById("interviewList");

    interviewList.innerHTML = interviews
      .map(
        (interview) => `
        <li>
          <strong>Company:</strong> ${interview.companyName}<br>
          <strong>Position:</strong> ${interview.position}<br>
          <strong>Questions:</strong> ${interview.questions.join(", ")}<br>
          <strong>Shared By:</strong> ${interview.sharedBy}<br>
          <strong>Date:</strong> ${new Date(
            interview.timestamp * 1000
          ).toLocaleDateString()}
        </li>
      `
      )
      .join("");
  } catch (error) {
    console.error("Error fetching interviews:", error);
  }
}

// Helper function to refresh student info
async function refreshStudentInfo() {
  try {
    const studentInfo = await studentRegistry.methods
      .getStudentInfo(currentAccount)
      .call();

    document.getElementById("currentStudentInfo").innerHTML = `
      <p>Name: ${studentInfo.name}</p>
      <p>Student ID: ${studentInfo.studentId}</p>
      <p>Year of Study: ${studentInfo.yearOfStudy}</p>
    `;
  } catch (error) {
    console.error("Error fetching student info:", error);
  }
}

// refreshMentors function
async function refreshMentors() {
  try {
    const mentorDetails = await mentorshipProgram.methods
      .getMentorDetails(currentAccount)
      .call();

    const mentorList = document.getElementById("mentorList");
    mentorList.innerHTML = `
      <p><strong>Subject:</strong> ${mentorDetails.subject}</p>
      <p><strong>Skills:</strong> ${mentorDetails.skills.join(", ")}</p>
      <p><strong>Mentees:</strong> ${mentorDetails.mentees.join(", ")}</p>
    `;
  } catch (error) {
    console.error("Error fetching mentor details:", error);
  }
}

// Initial refresh calls
async function refreshAll() {
  await refreshStudentInfo();
  await refreshCompanies();
  await refreshInterviews();
  await refreshMentors();
}

refreshAll();
