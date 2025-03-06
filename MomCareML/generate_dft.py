from plantuml import PlantUML

# Use the public PlantUML server
plantuml_server = PlantUML(url='http://www.plantuml.com/plantuml')

uml_code = """
@startuml
actor Mother
actor "Community Health Worker" as CHW
actor Admin

rectangle "Maternal Health System" {
    (Submit Maternal Health Data)
    (Perform Risk Assessment)
    (Manage Appointments)
    (Generate Alerts & Notifications)
}

Mother --> (Submit Maternal Health Data)
CHW --> (Submit Maternal Health Data)
(Submit Maternal Health Data) --> (Perform Risk Assessment)
(Perform Risk Assessment) --> (Generate Alerts & Notifications)
(Manage Appointments) --> (Generate Alerts & Notifications)
Admin --> (Manage Appointments)
@enduml
"""

# Save diagram as PNG
output_file = "maternal_health_system_diagram.png"
plantuml_server.processes(uml_code, outfile=output_file)

print(f"Diagram saved as {output_file}")
