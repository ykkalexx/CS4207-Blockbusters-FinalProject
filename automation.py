import json
import time
import random
import string
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
with open("build/contracts/PeerNetwork.json") as f:
    peer_network_data = json.load(f)

# Contract addresses
student_registry_address = "0xF225E490651C795F9C8F9a6846aE0E789879fB83"
cv_share_address = "0x8B155776FcB9BA0aD0d116701d914f7369c7f5f2"
interview_share_address = "0xA628E932AF349915c606A70585e8Fc79f10cC566"
mentorship_program_address = "0x9Df68981BdCe20Ede4BA892480788F1DEB2F919f"
peer_network_address = "0xd40825688C40288b9f78d865114c563C59A468A8"

# Initialize contracts
student_registry = web3.eth.contract(address=student_registry_address, abi=student_registry_data["abi"])
cv_share = web3.eth.contract(address=cv_share_address, abi=cv_share_data["abi"])
interview_share = web3.eth.contract(address=interview_share_address, abi=interview_share_data["abi"])
mentorship_program = web3.eth.contract(address=mentorship_program_address, abi=mentorship_program_data["abi"])
peer_network = web3.eth.contract(address=peer_network_address, abi=peer_network_data["abi"])

def generate_random_name():
    """Generate a random student name"""
    first_names = ["Emma", "Liam", "Olivia", "Noah", "Ava", "Ethan", "Sophia", "Mason", 
                   "Isabella", "William", "Mia", "James", "Evelyn", "Alexander", "Harper", "Benjamin","Charlotte"]
    last_names = ["Smith", "Johnson", "Brown", "Davis", "Miller", "Wilson", "Moore", 
                  "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia"]
    return f"{random.choice(first_names)} {random.choice(last_names)}"

def is_student_registered(account):
    """Check if a student is already registered"""
    try:
        student_info = student_registry.functions.getStudentInfo(account).call()
        return True
    except Exception as e:
        if "Student not found" in str(e):
            return False
        print(f"Error checking student registration: {e}")
        return False

def is_mentor_registered(account):
    """Check if a mentor is already registered"""
    try:
        mentor_info = mentorship_program.functions.getMentorDetails(account).call()
        return mentor_info[0] != "0x0000000000000000000000000000000000000000"
    except Exception as e:
        print(f"Error checking mentor registration: {e}")
        return False

def register_student(name, student_id, year, account):
    """Register a student if not already registered"""
    if is_student_registered(account):
        print(f"Student {name} is already registered with account {account}")
        return True
    
    try:
        tx_hash = student_registry.functions.registerStudent(name, student_id, year).transact({"from": account})
        receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
        print(f"Successfully registered student {name}")
        return True
    except Exception as e:
        print(f"Error registering student {name}: {e}")
        return False

def register_mentor(name, student_id, skills, subject, account):
    """Register an account as both student and mentor"""
    if not is_student_registered(account):
        success = register_student(name, student_id, 4, account)
        if not success:
            print(f"Failed to register {name} as student. Cannot proceed with mentor registration.")
            return False
    
    if is_mentor_registered(account):
        print(f"Account {account} is already registered as a mentor")
        return True
    
    try:
        tx_hash = mentorship_program.functions.registerAsMentor(skills, subject).transact({"from": account})
        receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
        print(f"Successfully registered mentor with account {account}")
        return True
    except Exception as e:
        print(f"Error registering mentor: {e}")
        return False

def share_cv(ipfs_hash, is_public, account):
    """Share a CV with the specified visibility"""
    try:
        tx_hash = cv_share.functions.shareCV(ipfs_hash, is_public).transact({"from": account})
        receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
        print(f"Successfully shared CV with hash {ipfs_hash}")
        return True
    except Exception as e:
        print(f"Error sharing CV: {e}")
        return False

def share_interview(company_name, questions, position, account):
    """Share interview experience"""
    try:
        tx_hash = interview_share.functions.shareInterview(company_name, questions, position).transact({"from": account})
        receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
        print(f"Successfully shared interview for {company_name}")
        return True
    except Exception as e:
        print(f"Error sharing interview: {e}")
        return False

def add_company(company_name, account):
    """Add a new company to the peer network"""
    try:
        tx_hash = peer_network.functions.addCompany(company_name).transact({"from": account})
        receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
        print(f"Successfully added company {company_name}")
        return True
    except Exception as e:
        print(f"Error adding company: {e}")
        return False

def add_mentee(mentor_account, mentee_account, amount):
    """Add a mentee to a mentor's group and transfer funds"""
    try:
        # Convert amount from Ether to Wei using Web3.to_wei()
        amount_wei = web3.to_wei(amount, 'ether')
        tx_hash = mentorship_program.functions.addMentee(
            web3.to_checksum_address(mentee_account)
        ).transact({
            "from": web3.to_checksum_address(mentor_account),
            "value": amount_wei
        })
        receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
        print(f"Successfully added mentee {mentee_account} to mentor {mentor_account} with {amount} Ether")
        return True
    except Exception as e:
        print(f"Error adding mentee: {e}")
        return False

def view_companies():
    """View all companies in the peer network"""
    try:
        companies = peer_network.functions.getCompanies().call()
        for company in companies:
            print(f"Company: {company}")
    except Exception as e:
        print(f"Error viewing companies: {e}")

def view_interviews():
    """View all interview questions shared"""
    try:
        interviews = interview_share.functions.getAllInterviews().call()
        for interview in interviews:
            print(f"Company: {interview[0]}")
            print(f"Position: {interview[2]}")
            print(f"Questions: {interview[1]}")
            print(f"Timestamp: {interview[3]}")
            print(f"Shared By: {interview[4]}")
    except Exception as e:
        print(f"Error viewing interviews: {e}")

def main():
    # First find two unregistered accounts
    unregistered_accounts = []
    
    print("Finding unregistered accounts...")
    for account in accounts:
        if not is_student_registered(account):
            unregistered_accounts.append(account)
            if len(unregistered_accounts) == 2:
                break
    
    if len(unregistered_accounts) < 2:
        print("Error: Need 2 unregistered accounts, but found only", len(unregistered_accounts))
        return
    
    # Use first unregistered account for 4th year student (mentor)
    mentor_account = unregistered_accounts[0]
    mentor_name = generate_random_name()
    print(f"\nRegistering 4th year student (future mentor) {mentor_name}...")
    
    mentor_success = register_student(
        name=mentor_name,
        student_id=9999,
        year=4,  # Explicitly 4th year
        account=mentor_account
    )
    
    # Use second unregistered account for 3rd year student (mentee)
    mentee_account = unregistered_accounts[1]
    mentee_name = generate_random_name()
    print(f"\nRegistering 3rd year student (future mentee) {mentee_name}...")
    
    mentee_success = register_student(
        name=mentee_name,
        student_id=8888,
        year=3,  # Explicitly 3rd year
        account=mentee_account
    )
    
    if mentor_success and mentee_success:
        print("\nRegistering 4th year student as mentor...")
        
        # Register the 4th year student as mentor
        mentor_registered = register_mentor(
            name=mentor_name,
            student_id=9999,
            skills=["Solidity", "Blockchain"],
            subject="Smart Contracts",
            account=mentor_account
        )
        
        if mentor_registered:
            print(f"\nAttempting to add {mentee_name} as mentee...")
            
            # Add the 3rd year student as mentee
            if add_mentee(mentor_account, mentee_account, 0.1):  # Transfer 0.1 Ether
                print(f"\nSuccessfully set up mentor-mentee relationship between {mentor_name} and {mentee_name}")
                
                # Share mentor's CV and interview experience
                share_cv("QmTestHash", True, mentor_account)
                share_interview("Tech Corp", ["What is X?", "How would you Y?"], "Software Engineer", mentor_account)
                add_company("Tech Corp", mentor_account)
                
                # View final state
                print("\nViewing all companies:")
                view_companies()
                print("\nViewing all interview questions:")
                view_interviews()
            else:
                print("\nFailed to add mentee to mentor's group")
        else:
            print("\nFailed to register mentor")
    else:
        print("\nFailed to register one or both students")

if __name__ == "__main__":
    main()