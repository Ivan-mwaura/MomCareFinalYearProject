// config/visitSchedules.js

module.exports = {
    ancVisits: [
      {
        title: "1st ANC Visit – Booking Visit (Before 12 Weeks)",
        thresholdWeeks: 12,
        purpose: "Confirm pregnancy and establish baseline health status.",
        details: [
          "Confirmation of pregnancy",
          "Detailed medical history, lab tests, and risk assessment",
          "Counseling on nutrition, lifestyle, and supplementation (e.g., folic acid, iron)"
        ]
      },
      {
        title: "2nd ANC Visit – Early Pregnancy Assessment (16 Weeks)",
        thresholdWeeks: 16,
        purpose: "Ensure early fetal viability and address common early symptoms.",
        details: [
          "Fetal heartbeat check and overall maternal health evaluation",
          "Infection screening (e.g., HIV, syphilis, malaria)",
          "Management of common pregnancy symptoms such as nausea and fatigue"
        ]
      },
      {
        title: "3rd ANC Visit – Fetal Growth and Development Check (20-24 Weeks)",
        thresholdWeeks: 22, // using a median value
        purpose: "Monitor fetal development and maternal well-being during mid-pregnancy.",
        details: [
          "Monitoring blood pressure and fetal growth",
          "Anomaly scan (if available)",
          "Counseling on warning signs and potential complications"
        ]
      },
      {
        title: "4th ANC Visit – Mid-Pregnancy Screening (28 Weeks)",
        thresholdWeeks: 28,
        purpose: "Assess fetal activity and maternal health during the second half of pregnancy.",
        details: [
          "Checking fetal movement and heartbeat",
          "Administration of anti-D injection for Rh-negative mothers",
          "Gestational diabetes screening"
        ]
      },
      {
        title: "5th ANC Visit – Late Pregnancy Monitoring (32 Weeks)",
        thresholdWeeks: 32,
        purpose: "Review fetal development and prepare for delivery.",
        details: [
          "Monitoring fetal growth and amniotic fluid levels",
          "Reviewing the birth plan and discussing signs of labor",
          "Providing tetanus immunization (if not already administered)"
        ]
      },
      {
        title: "6th ANC Visit – Pre-Labor Assessment (36 Weeks)",
        thresholdWeeks: 36,
        purpose: "Ensure readiness for labor and address any late-pregnancy concerns.",
        details: [
          "Assessing fetal position (cephalic or breech)",
          "Screening for preeclampsia, anemia, and other complications",
          "Finalizing birth preparedness plans"
        ]
      },
      {
        title: "7th ANC Visit – Final Weeks Check-up (38 Weeks)",
        thresholdWeeks: 38,
        purpose: "Confirm fetal well-being and reinforce emergency preparedness.",
        details: [
          "Monitoring fetal heart rate and movements",
          "Reinforcing knowledge of emergency signs (e.g., bleeding, reduced fetal movements)",
          "Final review and confirmation of delivery plans"
        ]
      },
      {
        title: "8th ANC Visit – Due Date Monitoring (40 Weeks, If Not Delivered Yet)",
        thresholdWeeks: 40,
        purpose: "Monitor fetal health as the pregnancy reaches or exceeds full term.",
        details: [
          "Assessment via ultrasound or non-stress test",
          "Discussion of induction options if pregnancy extends beyond 41 weeks",
          "Continued monitoring of maternal health"
        ]
      }
    ],
    pncVisits: [
      {
        title: "1st PNC Visit – Immediate Postpartum Check (Within 24 Hours of Birth)",
        timing: "Within 24 hours of birth",
        purpose: "Ensure immediate safety and stabilization of both mother and newborn.",
        details: [
          "Assess maternal vital signs and bleeding",
          "Newborn assessment (APGAR score, breathing, weight)",
          "Initiate breastfeeding and encourage skin-to-skin contact"
        ]
      },
      {
        title: "2nd PNC Visit – Early Neonatal Follow-Up (Around 3 Days After Birth)",
        timing: "Around 3 days after birth",
        purpose: "Monitor initial recovery and detect early issues.",
        details: [
          "Check for neonatal jaundice",
          "Monitor healing of any birth-related injuries (e.g., C-section, episiotomy)",
          "Screen maternal mental health and emotional well-being"
        ]
      },
      {
        title: "3rd PNC Visit – Infant and Maternal Health Review (Around 7 Days After Birth)",
        timing: "Around 7 days after birth",
        purpose: "Evaluate progress in both infant and maternal recovery.",
        details: [
          "Ensure proper breastfeeding and monitor infant weight gain",
          "Examine umbilical cord healing",
          "Monitor for postpartum infections"
        ]
      },
      {
        title: "4th PNC Visit – Growth and Postpartum Recovery Check (Around 14 Days After Birth)",
        timing: "Around 14 days after birth",
        purpose: "Assess overall growth and recovery during the early postnatal period.",
        details: [
          "Evaluate newborn growth and developmental milestones",
          "Assess maternal recovery and screen for postpartum depression",
          "Reinforce maternal nutrition and self-care practices"
        ]
      },
      {
        title: "5th PNC Visit – Infant Immunization & Development Check (Approximately 28 Days/4 Weeks After Birth)",
        timing: "Approximately 28 days (4 weeks) after birth",
        purpose: "Ensure early development of the infant and initiate immunizations.",
        details: [
          "Full examination of the baby’s neurological and motor development",
          "Administration of initial immunizations (e.g., BCG, polio, hepatitis B)",
          "Discussion of family planning options for the mother"
        ]
      },
      {
        title: "6th PNC Visit – Comprehensive Postnatal Exam (Around 6 Weeks After Birth)",
        timing: "Around 6 weeks after birth",
        purpose: "Conduct a detailed review of maternal and infant health.",
        details: [
          "Comprehensive maternal check-up (e.g., wound healing, uterine involution)",
          "Monitor infant’s weight, feeding, and overall well-being",
          "Screen for postpartum complications such as infections or hemorrhage"
        ]
      },
      {
        title: "7th PNC Visit – Ongoing Infant Care & Vaccination (Around 3 Months After Birth)",
        timing: "Around 3 months after birth",
        purpose: "Continue monitoring and support for the infant’s growth and maternal recovery.",
        details: [
          "Follow-up immunizations (e.g., DTP, polio, hepatitis B boosters)",
          "Assessment of infant’s social, cognitive, and physical development",
          "Provide ongoing breastfeeding support and weaning guidance"
        ]
      },
      {
        title: "8th PNC Visit – Half-Year Growth & Development Assessment (Around 6 Months After Birth)",
        timing: "Around 6 months after birth",
        purpose: "Review the long-term progress of the infant and maternal health.",
        details: [
          "Monitor baby’s developmental milestones (e.g., rolling, sitting, beginning to crawl)",
          "Comprehensive maternal health review and address any lingering issues",
          "Counsel on complementary feeding, ongoing immunizations, and further developmental support"
        ]
      }
    ]
  };
  