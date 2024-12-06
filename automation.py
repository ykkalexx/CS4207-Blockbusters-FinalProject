import json
import time
from web3 import Web3

# Connect to local Ganache
ganache_url = "http://127.0.0.1:7545"
web3 = Web3(Web3.HTTPProvider(ganache_url))

# Check connection
if not web3.is_connected():
    raise Exception("Failed to connect to Ganache")

# Load accounts
accounts = web3.eth.accounts

# Load contract ABIs
with open("build/contracts/StudentRegistry.json") as f:
    student_registry_data = json.load(f)
with open("build/contracts/InterviewShare.json") as f:
    interview_share_data = json.load(f)
with open("build/contracts/CVShare.json") as f:
    cv_share_data = json.load(f)
with open("build/contracts/MentorshipProgram.json") as f:
    mentorship_program_data = json.load(f)

# Contract addresses
student_registry_address = "0x92A160825D89C0F5BA3F7F08A9357069E34d4406"
cv_share_address = "0x2ED665145A1cFB3996d14005fBcB63e416990130"
interview_share_address = "0x3366084ED3e7AE27AEe838c3bF91Ca444Cf36BFe"
mentorship_program_address = "0x08Ac38B9E2594aAc780Dba9f7d7c26761558c226"

# Initialize contracts
student_registry = web3.eth.contract(address=student_registry_address, abi=student_registry_data["abi"])
cv_share = web3.eth.contract(address=cv_share_address, abi=cv_share_data["abi"])
interview_share = web3.eth.contract(address=interview_share_address, abi=interview_share_data["abi"])
mentorship_program = web3.eth.contract(address=mentorship_program_address, abi=mentorship_program_data["abi"])

# Register students
def register_student(name, student_id, year, account):
    tx_hash = student_registry.functions.registerStudent(name, student_id, year).transact({"from": account})
    web3.eth.wait_for_transaction_receipt(tx_hash)

# Register mentors
def register_mentor(skills, subject, account):
    tx_hash = mentorship_program.functions.registerAsMentor(skills, subject).transact({"from": account})
    web3.eth.wait_for_transaction_receipt(tx_hash)

# Share CV
def share_cv(ipfs_hash, is_public, account):
    tx_hash = cv_share.functions.shareCV(ipfs_hash, is_public).transact({"from": account})
    web3.eth.wait_for_transaction_receipt(tx_hash)

# Share interview
def share_interview(company_name, questions, position, account):
    tx_hash = interview_share.functions.shareInterview(company_name, questions, position).transact({"from": account})
    web3.eth.wait_for_transaction_receipt(tx_hash)

# Example usage
register_student("Alice", 1, 4, accounts[0])
register_mentor(["Solidity", "Blockchain"], "Smart Contracts", accounts[0])
share_cv("QmTestHash", True, accounts[0])
share_interview("Tech Corp", ["What is X?", "How would you Y?"], "Software Engineer", accounts[0])

print("Automation script executed successfully")