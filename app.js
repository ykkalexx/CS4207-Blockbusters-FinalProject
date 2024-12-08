console.log("Loading app.js");

let web3;
console.log("Web3 initialized:", web3);
let studentRegistry;
let cvShare;
let interviewShare;
let peerNetwork;
let currentAccount;
let mentorshipProgram;

const studentRegistryAddress = "0x92A160825D89C0F5BA3F7F08A9357069E34d4406";
const cvShareAddress = "0x2ED665145A1cFB3996d14005fBcB63e416990130";
const interviewShareAddress = "0x3366084ED3e7AE27AEe838c3bF91Ca444Cf36BFe";
const peerNetworkAddress = "0xeaBEC35d03B8FC1981C6239EFEB0FD3e1BE86649";
const mentorshipNetworkAddress = "0x08Ac38B9E2594aAc780Dba9f7d7c26761558c226";

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
  } catch (error) {
    console.error("Initialization failed:", error);
  }
}

window.addEventListener("load", init);

async function registerStudent() {
  try {
    const name = document.getElementById("studentName").value;
    const id = document.getElementById("studentId").value;
    const year = document.getElementById("yearOfStudy").value;

    await studentRegistry.methods
      .registerStudent(name, id, year)
      .send({ from: currentAccount });
    alert("Student registered successfully!");
  } catch (error) {
    alert("Error registering student: " + error.message);
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

async function addCompany() {
  try {
    const company = document.getElementById("addCompany").value;

    await peerNetwork.methods
      .addCompany(company)
      .send({ from: currentAccount });
    alert(`Company ${company} added successfully!`);
  } catch (error) {
    alert("Error adding company: " + error.message);
  }
}

async function viewCompanies() {
  try {
    const companies = await peerNetwork.methods.getCompanies().call();
    const companyList = document.getElementById("companyList");
    companyList.innerHTML = companies
      .map((company) => `<li>${company}</li>`)
      .join("");
  } catch (error) {
    alert("Error fetching companies: " + error.message);
  }
}

async function linkCVToCompany() {
  try {
    const company = document.getElementById("linkCompany").value;
    const ipfsHash = document.getElementById("linkCV").value;

    await peerNetwork.methods
      .linkCVToCompany(company, ipfsHash)
      .send({ from: currentAccount });
    alert(`CV linked to ${company} successfully!`);
  } catch (error) {
    alert("Error linking CV to company: " + error.message);
  }
}

async function registerAsMentor() {
  try {
    const skills = document
      .getElementById("mentorSkills")
      .value.split(",")
      .map((s) => s.trim());
    const subject = document.getElementById("mentorSubject").value;

    const studentInfo = await studentRegistry.methods
      .getStudentInfo(currentAccount)
      .call();

    if (Number(studentInfo.yearOfStudy) !== 4) {
      alert("Only 4th year students can register as mentors.");
      return;
    }

    await mentorshipProgram.methods
      .registerAsMentor(skills, subject)
      .send({ from: currentAccount });
    alert("Registered as mentor successfully!");
  } catch (error) {
    console.error("Register mentor error:", error);
    alert("Error registering as mentor: " + error.message);
  }
}

async function viewMentors() {
  try {
    const studentInfo = await studentRegistry.methods
      .getStudentInfo(currentAccount)
      .call();

    if (Number(studentInfo.yearOfStudy) === 4) {
      alert("4th year students cannot view the mentors list.");
      return;
    }

    const totalStudents = await studentRegistry.methods.totalStudents().call();
    const mentorList = document.getElementById("mentorList");
    mentorList.innerHTML = "";

    for (let i = 0; i < totalStudents; i++) {
      try {
        const studentAddress = await studentRegistry.methods
          .studentIdToAddress(i)
          .call();
        const mentorDetails = await mentorshipProgram.methods
          .getMentorDetails(studentAddress)
          .call();

        if (
          mentorDetails.mentorAddress !==
          "0x0000000000000000000000000000000000000000"
        ) {
          const mentorItem = `<li>
            <strong>Address:</strong> ${mentorDetails.mentorAddress}<br>
            <strong>Skills:</strong> ${mentorDetails.skills.join(", ")}<br>
            <strong>Subject:</strong> ${mentorDetails.subject}<br>
            <strong>Mentees:</strong> ${mentorDetails.mentees.join(", ")}
          </li>`;
          mentorList.innerHTML += mentorItem;
        }
      } catch (err) {
        console.warn(`Error fetching mentor at index ${i}:`, err);
        continue;
      }
    }
  } catch (error) {
    console.error("View mentors error:", error);
    alert("Error fetching mentors: " + error.message);
  }
}

async function viewInterviews() {
  try {
    const studentInfo = await studentRegistry.methods
      .getStudentInfo(currentAccount)
      .call();
    if (Number(studentInfo.yearOfStudy) === 4) {
      alert("4th year students cannot view the interview questions.");
      return;
    }

    const totalStudents = await studentRegistry.methods.totalStudents().call();
    const interviewList = document.getElementById("interviewList");
    interviewList.innerHTML = "";

    for (let i = 0; i < totalStudents; i++) {
      try {
        const studentAddress = await studentRegistry.methods
          .studentIdToAddress(i)
          .call();
        const studentInterviews = await interviewShare.methods
          .companyInterviews(studentAddress, 0)
          .call();

        if (studentInterviews.companyName) {
          const interviewItem = `<li>
            <strong>Company:</strong> ${studentInterviews.companyName}<br>
            <strong>Position:</strong> ${studentInterviews.position}<br>
            <strong>Questions:</strong> ${studentInterviews.questions.join(
              ", "
            )}<br>
            <strong>Shared By:</strong> ${studentInterviews.sharedBy}
          </li>`;
          interviewList.innerHTML += interviewItem;
        }
      } catch (err) {
        console.warn(`Error fetching interview at index ${i}:`, err);
        continue;
      }
    }
  } catch (error) {
    console.error("View interviews error:", error);
    alert("Error fetching interviews: " + error.message);
  }
}
