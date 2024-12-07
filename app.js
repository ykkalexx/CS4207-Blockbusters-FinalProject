console.log("Loading app.js");

let web3;
console.log("Web3 initialized:", web3);
let studentRegistry;
let cvShare;
let interviewShare;
let peerNetwork;
let currentAccount;

const studentRegistryAddress = "0x0FB05C09C59aC73844CFc544b972128707f163Ff";
const cvShareAddress = "0x6c529c8540C8B04EE07ccd998A3ecd4Ca5281f55";
const interviewShareAddress = "0x08E5b7a6d37E0DA5E79842674eb86db968EbC74B";
const peerNetworkAddress = "0xeaBEC35d03B8FC1981C6239EFEB0FD3e1BE86649";

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
    constant: true,
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
    constant: true,
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
    constant: true,
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
    constant: true,
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
    studentRegistry = new web3.eth.Contract(StudentRegistryABI, studentRegistryAddress);
    cvShare = new web3.eth.Contract(CVShareABI, cvShareAddress);
    interviewShare = new web3.eth.Contract(InterviewShareABI, interviewShareAddress);
    peerNetwork = new web3.eth.Contract(PeerNetworkABI, peerNetworkAddress);
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

    await studentRegistry.methods.registerStudent(name, id, year).send({ from: currentAccount });
    alert("Student registered successfully!");
  } catch (error) {
    alert("Error registering student: " + error.message);
  }
}

async function shareCV() {
  try {
    const ipfsHash = document.getElementById("ipfsHash").value;
    const isPublic = document.getElementById("isPublic").checked;

    await cvShare.methods.shareCV(ipfsHash, isPublic).send({ from: currentAccount });
    alert("CV shared successfully!");
  } catch (error) {
    alert("Error sharing CV: " + error.message);
  }
}

async function shareInterview() {
  try {
    const companyName = document.getElementById("companyName").value;
    const position = document.getElementById("position").value;
    const questions = document.getElementById("questions").value.split(",").map((q) => q.trim());

    await interviewShare.methods.shareInterview(companyName, questions, position).send({ from: currentAccount });
    alert("Interview experience shared successfully!");
  } catch (error) {
    alert("Error sharing interview: " + error.message);
  }
}

async function addCompany() {
  try {
    const company = document.getElementById("addCompany").value;

    await peerNetwork.methods.addCompany(company).send({ from: currentAccount });
    alert(`Company ${company} added successfully!`);
  } catch (error) {
    alert("Error adding company: " + error.message);
  }
}

async function viewCompanies() {
  try {
    const companies = await peerNetwork.methods.getCompanies().call();
    const companyList = document.getElementById("companyList");
    companyList.innerHTML = companies.map((company) => `<li>${company}</li>`).join("");
  } catch (error) {
    alert("Error fetching companies: " + error.message);
  }
}

async function linkCVToCompany() {
  try {
    const company = document.getElementById("linkCompany").value;
    const ipfsHash = document.getElementById("linkCV").value;

    await peerNetwork.methods.linkCVToCompany(company, ipfsHash).send({ from: currentAccount });
    alert(`CV linked to ${company} successfully!`);
  } catch (error) {
    alert("Error linking CV to company: " + error.message);
  }
}
