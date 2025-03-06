from graphviz import Digraph

# Generate Level 1 Data Flow Diagram (DFD)
dfd = Digraph("DFD_Level1", format="png")

# External entities
dfd.node("User", "Healthcare Provider", shape="parallelogram")
dfd.node("Admin", "System Administrator", shape="parallelogram")

# Processes
dfd.node("P1", "Data Collection & Input", shape="ellipse")
dfd.node("P2", "Maternal Health Risk Prediction", shape="ellipse")
dfd.node("P3", "Alerts & Notifications", shape="ellipse")
dfd.node("P4", "Reporting & Visualization", shape="ellipse")

# Data stores
dfd.node("D1", "Patient Database", shape="cylinder")
dfd.node("D2", "Risk Assessment Logs", shape="cylinder")

# Data flow connections
dfd.edge("User", "P1", label="Enter Patient Data")
dfd.edge("P1", "D1", label="Store Patient Info")
dfd.edge("D1", "P2", label="Retrieve Patient Data")
dfd.edge("P2", "D2", label="Save Risk Prediction")
dfd.edge("D2", "P3", label="Trigger Alerts")
dfd.edge("P3", "User", label="Send Notifications")
dfd.edge("D2", "P4", label="Generate Reports")
dfd.edge("P4", "User", label="View Reports")
dfd.edge("Admin", "P4", label="Manage Reports")

dfd.render("DFD_Level1", format="png", cleanup=True)

# Generate Use Case Diagram
use_case = Digraph("Use_Case_Diagram", format="png")

# Actors
use_case.node("User", "Healthcare Provider", shape="parallelogram")
use_case.node("Admin", "System Administrator", shape="parallelogram")

# Use Cases
use_case.node("UC1", "Enter Patient Data", shape="ellipse")
use_case.node("UC2", "Predict Maternal Health Risk", shape="ellipse")
use_case.node("UC3", "Generate Alerts", shape="ellipse")
use_case.node("UC4", "View Reports", shape="ellipse")
use_case.node("UC5", "Manage System Users", shape="ellipse")

# Relationships
use_case.edge("User", "UC1")
use_case.edge("UC1", "UC2")
use_case.edge("UC2", "UC3")
use_case.edge("UC3", "User", label="Receive Alerts")
use_case.edge("UC2", "UC4")
use_case.edge("User", "UC4")
use_case.edge("Admin", "UC5")

use_case.render("Use_Case_Diagram", format="png", cleanup=True)

# Generate Class Diagram
class_diagram = Digraph("Class_Diagram", format="png")

# Classes
class_diagram.node("Patient", "Patient\n- ID\n- Name\n- Age\n- Medical History", shape="record")
class_diagram.node("RiskModel", "RiskModel\n- Prediction Algorithm\n- Risk Score", shape="record")
class_diagram.node("AlertSystem", "AlertSystem\n- Alert ID\n- Risk Level\n- Notification", shape="record")
class_diagram.node("Report", "Report\n- Report ID\n- Patient Data\n- Risk Summary", shape="record")
class_diagram.node("UserAccount", "UserAccount\n- Username\n- Role\n- Access Level", shape="record")

# Relationships
class_diagram.edge("Patient", "RiskModel", label="Submits Data")
class_diagram.edge("RiskModel", "AlertSystem", label="Generates Risk Alerts")
class_diagram.edge("RiskModel", "Report", label="Generates Reports")
class_diagram.edge("AlertSystem", "UserAccount", label="Sends Alerts")
class_diagram.edge("Report", "UserAccount", label="Views Reports")

class_diagram.render("Class_Diagram", format="png", cleanup=True)

print("Diagrams generated successfully. Check the output directory.")
