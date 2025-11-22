module.exports = {
  // Standard Antenatal Care (ANC) Visits (8 visits)
  ancVisits: [
    {
      title: "1st ANC Visit – Booking Visit",
      thresholdWeeks: 12,
      purpose: "Confirm pregnancy and establish baseline health status",
      details: [
        "Confirmation of pregnancy (urine/blood test)",
        "Detailed medical and obstetric history",
        "Physical exam (weight, height, BP)",
        "Baseline lab tests (Hb, blood group, HIV, syphilis)",
        "Risk assessment and referral if needed",
        "Counseling on nutrition, exercise, and supplementation (folic acid, iron)",
        "Tetanus toxoid vaccination (1st dose)",
        "Establish estimated due date (EDD) via ultrasound or LMP",
      ],
    },
    {
      title: "2nd ANC Visit – Early Pregnancy Assessment",
      thresholdWeeks: 16,
      purpose: "Monitor early fetal viability and maternal health",
      details: [
        "Fetal heartbeat check (Doppler)",
        "Screening for infections (e.g., UTI, malaria in endemic areas)",
        "Review maternal symptoms (nausea, fatigue)",
        "Counseling on danger signs (bleeding, severe pain)",
        "Nutritional assessment and supplementation adjustment",
        "Discuss birth preparedness",
      ],
    },
    {
      title: "3rd ANC Visit – Fetal Growth Check",
      thresholdWeeks: 22,
      purpose: "Assess fetal development and maternal well-being",
      details: [
        "Ultrasound for fetal growth and anomalies (if available)",
        "Measure fundal height",
        "Blood pressure and weight monitoring",
        "Review lab results and address deficiencies (e.g., anemia)",
        "Counseling on fetal movements and self-care",
        "Tetanus toxoid vaccination (2nd dose, if needed)",
      ],
    },
    {
      title: "4th ANC Visit – Mid-Pregnancy Screening",
      thresholdWeeks: 28,
      purpose: "Screen for complications and prepare for third trimester",
      details: [
        "Gestational diabetes screening (oral glucose tolerance test)",
        "Blood pressure check for preeclampsia risk",
        "Hemoglobin test for anemia",
        "Fetal movement and heart rate monitoring",
        "Counseling on breastfeeding and family planning",
        "Review birth plan and emergency contacts",
      ],
    },
    {
      title: "5th ANC Visit – Late Pregnancy Monitoring",
      thresholdWeeks: 32,
      purpose: "Monitor maternal and fetal health in late pregnancy",
      details: [
        "Fetal position check (presentation)",
        "Fundal height measurement",
        "Blood pressure and edema check",
        "Screen for infections (e.g., Group B Streptococcus)",
        "Counseling on labor signs and hospital preparation",
        "Update birth plan if needed",
      ],
    },
    {
      title: "6th ANC Visit – Pre-Labor Assessment",
      thresholdWeeks: 36,
      purpose: "Prepare for labor and delivery",
      details: [
        "Cervical assessment (if indicated)",
        "Fetal heart rate and position monitoring",
        "Blood pressure and weight check",
        "Counseling on labor process, pain management, and danger signs",
        "Confirm delivery location and transport plan",
        "Review postpartum care expectations",
      ],
    },
    {
      title: "7th ANC Visit – Final Pre-Labor Check",
      thresholdWeeks: 38,
      purpose: "Ensure readiness for delivery",
      details: [
        "Fetal heart rate monitoring",
        "Assess fetal position and engagement",
        "Blood pressure and maternal symptom review",
        "Counseling on when to seek care (e.g., contractions, water breaking)",
        "Final review of birth and emergency plan",
      ],
    },
    {
      title: "8th ANC Visit – Delivery Prep",
      thresholdWeeks: 40,
      purpose: "Final check before expected delivery",
      details: [
        "Confirm delivery plan and logistics",
        "Fetal heart rate and movement check",
        "Blood pressure and maternal health assessment",
        "Discuss induction if overdue",
        "Counseling on immediate postpartum care and newborn needs",
      ],
    },
  ],
  // Postnatal Care (PNC) Visits (8 visits)
  pncVisits: [
    {
      title: "1st PNC Visit – Immediate Postpartum Check",
      timing: "Within 24 hours of birth",
      purpose: "Ensure immediate safety and stabilization of mother and newborn",
      details: [
        "Assess maternal vital signs (BP, pulse, bleeding)",
        "Check uterine involution and perineal healing",
        "Initiate breastfeeding and assess latch",
        "Newborn exam (weight, temp, breathing)",
        "Counseling on postpartum danger signs (fever, heavy bleeding)",
        "Vitamin A supplementation (if indicated)",
      ],
    },
    {
      title: "2nd PNC Visit – Early Postpartum Check",
      timing: "Day 3 after birth",
      purpose: "Monitor recovery and early newborn health",
      details: [
        "Check maternal bleeding and infection signs",
        "Assess breastfeeding progress",
        "Newborn weight and jaundice check",
        "Counseling on cord care and hygiene",
        "Emotional well-being assessment (postpartum blues)",
      ],
    },
    {
      title: "3rd PNC Visit – First Week Assessment",
      timing: "Day 7 after birth",
      purpose: "Ensure stable recovery and newborn growth",
      details: [
        "Maternal BP and wound healing check (if cesarean)",
        "Breastfeeding support and mastitis screening",
        "Newborn weight gain and umbilical cord status",
        "Immunizations (e.g., BCG, Hepatitis B)",
        "Counseling on family planning options",
      ],
    },
    {
      title: "4th PNC Visit – Two-Week Check",
      timing: "2 weeks after birth",
      purpose: "Assess ongoing recovery and newborn development",
      details: [
        "Maternal physical and emotional health check",
        "Screen for postpartum infection or depression",
        "Newborn growth and feeding assessment",
        "Counseling on maternal nutrition and rest",
        "Discuss contraception if not started",
      ],
    },
    {
      title: "5th PNC Visit – One-Month Check",
      timing: "4 weeks after birth",
      purpose: "Monitor longer-term recovery and infant health",
      details: [
        "Maternal BP and uterine involution check",
        "Assess breastfeeding or formula feeding",
        "Newborn growth, reflexes, and hearing screen",
        "Counseling on resuming activities and self-care",
        "Review family planning adherence",
      ],
    },
    {
      title: "6th PNC Visit – Comprehensive Postnatal Exam",
      timing: "6 weeks after birth",
      purpose: "Complete postpartum recovery assessment",
      details: [
        "Full maternal physical exam (BP, pelvic health)",
        "Screen for postpartum depression or anxiety",
        "Newborn developmental milestones check",
        "Immunizations (e.g., first dose DPT)",
        "Counseling on long-term contraception and health",
        "Referrals if complications persist",
      ],
    },
    {
      title: "7th PNC Visit – Three-Month Follow-Up",
      timing: "12 weeks after birth",
      purpose: "Ensure sustained maternal and infant well-being",
      details: [
        "Maternal health review (energy, bleeding cessation)",
        "Newborn growth and immunization update",
        "Breastfeeding or nutrition counseling",
        "Assess family planning effectiveness",
        "Discuss return to work or routine",
      ],
    },
    {
      title: "8th PNC Visit – Six-Month Check",
      timing: "24 weeks after birth",
      purpose: "Long-term health check for mother and baby",
      details: [
        "Maternal health and weight assessment",
        "Newborn growth, motor skills, and feeding transition",
        "Update immunizations (e.g., 6-month doses)",
        "Counseling on complementary feeding",
        "Screen for any delayed postpartum issues",
      ],
    },
  ],
  // Condition-specific adjustments tailored to ANC visits
  conditionAdjustments: {
    hypertension: {
      enhancements: {
        "2nd ANC Visit – Early Pregnancy Assessment": [
          "Blood pressure measurement",
          "Urine protein test (pre-preeclampsia screen)",
          "Counseling on salt intake and rest",
        ],
        "4th ANC Visit – Mid-Pregnancy Screening": [
          "Detailed preeclampsia risk assessment (BP, urine)",
          "Monitor for headache or swelling",
        ],
        "6th ANC Visit – Pre-Labor Assessment": [
          "Preeclampsia screening (BP, urine, symptoms)",
          "Plan for early delivery if severe",
        ],
      },
      supplementalVisits: [
        {
          title: "Hypertension Check",
          relativeTo: "2nd ANC Visit – Early Pregnancy Assessment",
          offsetWeeks: 2, // 16 + 2 = 18 weeks
          purpose: "Monitor BP to prevent hypertensive disorders",
          details: [
            "Blood pressure measurement",
            "Urine dipstick for protein",
            "Counseling on stress reduction",
          ],
          frequency: "Every 2 weeks", // 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38
        },
      ],
    },
    diabetes: {
      enhancements: {
        "3rd ANC Visit – Fetal Growth Check": [
          "Early glucose tolerance test (if not done earlier)",
          "Counseling on blood sugar control",
        ],
        "5th ANC Visit – Late Pregnancy Monitoring": [
          "Blood sugar monitoring (fasting, postprandial)",
          "Fetal growth ultrasound (check for macrosomia)",
        ],
        "7th ANC Visit – Final Pre-Labor Check": [
          "Final blood sugar assessment",
          "Plan delivery if uncontrolled",
        ],
      },
      supplementalVisits: [
        {
          title: "Diabetes Management",
          relativeTo: "3rd ANC Visit – Fetal Growth Check",
          offsetWeeks: 3, // 22 + 3 = 25 weeks
          purpose: "Control blood sugar and monitor fetal health",
          details: [
            "Blood glucose test (HbA1c if indicated)",
            "Dietary review and adjustment",
            "Fetal well-being check",
          ],
          frequency: "Every 3 weeks", // 25, 28, 31, 34, 37
        },
      ],
    },
    thyroidDisorders: {
      enhancements: {
        "1st ANC Visit – Booking Visit": [
          "Thyroid function test (TSH, T4, T3)",
          "Medication review (e.g., levothyroxine dose)",
          "Counseling on thyroid impact on pregnancy",
        ],
        "4th ANC Visit – Mid-Pregnancy Screening": [
          "Repeat thyroid function test",
          "Adjust thyroid medication if needed",
          "Monitor for symptoms (fatigue, weight changes)",
        ],
        "6th ANC Visit – Pre-Labor Assessment": [
          "Final thyroid function check before delivery",
          "Assess fetal growth impact",
        ],
      },
      supplementalVisits: [
        {
          title: "Thyroid Monitoring",
          relativeTo: "1st ANC Visit – Booking Visit",
          offsetWeeks: 4, // 12 + 4 = 16 weeks
          purpose: "Monitor thyroid levels and adjust treatment",
          details: [
            "TSH and free T4 check",
            "Symptom review (e.g., palpitations, lethargy)",
            "Counseling on thyroid management",
          ],
          frequency: "Every 4 weeks", // 16, 20, 24, 28, 32, 36
        },
      ],
    },
    obesity: {
      enhancements: {
        "1st ANC Visit – Booking Visit": [
          "BMI calculation and weight counseling",
          "Assess for gestational diabetes and hypertension risk",
        ],
        "4th ANC Visit – Mid-Pregnancy Screening": [
          "Enhanced glucose screening",
          "Monitor BP for hypertension risk",
        ],
        "5th ANC Visit – Late Pregnancy Monitoring": [
          "Fetal growth ultrasound (check for macrosomia)",
          "Counseling on labor challenges (e.g., cesarean risk)",
        ],
      },
      supplementalVisits: [
        {
          title: "Obesity Monitoring",
          relativeTo: "1st ANC Visit – Booking Visit",
          offsetWeeks: 6, // 12 + 6 = 18 weeks
          purpose: "Monitor weight and related risks",
          details: [
            "Weight check and BMI reassessment",
            "Diet and exercise counseling",
            "Fetal growth monitoring",
          ],
          frequency: "Every 6 weeks", // 18, 24, 30, 36
        },
      ],
    },
    hiv: {
      enhancements: {
        "1st ANC Visit – Booking Visit": [
          "Confirm HIV status (if not already positive)",
          "CD4 count and viral load test",
          "Initiate or adjust antiretroviral therapy (ART)",
        ],
        "3rd ANC Visit – Fetal Growth Check": [
          "Monitor ART adherence and side effects",
          "Repeat viral load if indicated",
        ],
        "6th ANC Visit – Pre-Labor Assessment": [
          "Plan for prevention of mother-to-child transmission (PMTCT)",
          "Counseling on delivery method (vaginal vs. cesarean)",
        ],
      },
      supplementalVisits: [
        {
          title: "HIV Monitoring",
          relativeTo: "1st ANC Visit – Booking Visit",
          offsetWeeks: 8, // 12 + 8 = 20 weeks
          purpose: "Monitor HIV management and fetal health",
          details: [
            "CD4 count or viral load check",
            "ART adherence counseling",
            "Screen for opportunistic infections",
          ],
          frequency: "Every 8 weeks", // 20, 28, 36
        },
      ],
    },
    syphilis: {
      enhancements: {
        "1st ANC Visit – Booking Visit": [
          "Confirm syphilis status (RPR/VDRL test)",
          "Initiate penicillin treatment if positive",
        ],
        "3rd ANC Visit – Fetal Growth Check": [
          "Repeat syphilis test if high risk",
          "Monitor treatment response",
        ],
        "5th ANC Visit – Late Pregnancy Monitoring": [
          "Fetal ultrasound for congenital syphilis signs",
          "Counseling on newborn screening",
        ],
      },
      supplementalVisits: [
        {
          title: "Syphilis Follow-Up",
          relativeTo: "1st ANC Visit – Booking Visit",
          offsetWeeks: 4, // 12 + 4 = 16 weeks
          purpose: "Monitor treatment efficacy",
          details: [
            "Repeat RPR test",
            "Assess maternal and fetal response",
          ],
          frequency: "Every 4 weeks", // 16, 20, 24, 28, 32, 36 (until resolved)
        },
      ],
    },
    malaria: {
      enhancements: {
        "2nd ANC Visit – Early Pregnancy Assessment": [
          "Malaria screening (blood smear or RDT)",
          "Initiate intermittent preventive treatment (IPTp) with sulfadoxine-pyrimethamine",
        ],
        "4th ANC Visit – Mid-Pregnancy Screening": [
          "Repeat IPTp dose",
          "Monitor for malaria symptoms",
        ],
        "6th ANC Visit – Pre-Labor Assessment": [
          "Final IPTp dose (if in endemic area)",
          "Assess anemia risk from malaria",
        ],
      },
      supplementalVisits: [
        {
          title: "Malaria Check",
          relativeTo: "2nd ANC Visit – Early Pregnancy Assessment",
          offsetWeeks: 4, // 16 + 4 = 20 weeks
          purpose: "Monitor and prevent malaria in pregnancy",
          details: [
            "Malaria test if symptomatic",
            "Counseling on bed nets and prevention",
          ],
          frequency: "Every 4 weeks", // 20, 24, 28, 32, 36 (in endemic areas)
        },
      ],
    },
    uti: {
      enhancements: {
        "2nd ANC Visit – Early Pregnancy Assessment": [
          "Urine culture and sensitivity test",
          "Initiate antibiotics if positive",
        ],
        "4th ANC Visit – Mid-Pregnancy Screening": [
          "Repeat urine test if prior UTI",
          "Monitor for recurrence",
        ],
        "6th ANC Visit – Pre-Labor Assessment": [
          "Final UTI screen before delivery",
          "Counseling on hygiene",
        ],
      },
      supplementalVisits: [
        {
          title: "UTI Follow-Up",
          relativeTo: "2nd ANC Visit – Early Pregnancy Assessment",
          offsetWeeks: 4, // 16 + 4 = 20 weeks
          purpose: "Monitor and treat recurrent UTIs",
          details: [
            "Urine dipstick or culture",
            "Adjust antibiotics if needed",
          ],
          frequency: "Every 4 weeks", // 20, 24, 28, 32, 36 (if recurrent)
        },
      ],
    },
    depression: {
      enhancements: {
        "1st ANC Visit – Booking Visit": [
          "Screen for depression (e.g., PHQ-9)",
          "Counseling referral if indicated",
        ],
        "4th ANC Visit – Mid-Pregnancy Screening": [
          "Reassess depression symptoms",
          "Monitor mental health support",
        ],
        "6th ANC Visit – Pre-Labor Assessment": [
          "Final prenatal depression screen",
          "Plan postpartum mental health care",
        ],
      },
      supplementalVisits: [
        {
          title: "Mental Health Check – Depression",
          relativeTo: "1st ANC Visit – Booking Visit",
          offsetWeeks: 8, // 12 + 8 = 20 weeks
          purpose: "Monitor maternal mental health",
          details: [
            "Depression screening (e.g., PHQ-9)",
            "Counseling or therapy session",
            "Assess support system",
          ],
          frequency: "Every 8 weeks", // 20, 28, 36
        },
      ],
    },
    anxiety: {
      enhancements: {
        "1st ANC Visit – Booking Visit": [
          "Screen for anxiety (e.g., GAD-7)",
          "Counseling referral if indicated",
        ],
        "4th ANC Visit – Mid-Pregnancy Screening": [
          "Reassess anxiety symptoms",
          "Monitor coping strategies",
        ],
        "6th ANC Visit – Pre-Labor Assessment": [
          "Final prenatal anxiety screen",
          "Plan postpartum support",
        ],
      },
      supplementalVisits: [
        {
          title: "Mental Health Check – Anxiety",
          relativeTo: "1st ANC Visit – Booking Visit",
          offsetWeeks: 8, // 12 + 8 = 20 weeks
          purpose: "Monitor maternal anxiety levels",
          details: [
            "Anxiety screening (e.g., GAD-7)",
            "Relaxation techniques counseling",
            "Assess triggers and support",
          ],
          frequency: "Every 8 weeks", // 20, 28, 36
        },
      ],
    },
    stressLevel: {
      enhancements: {
        "2nd ANC Visit – Early Pregnancy Assessment": [
          "Assess stress level (e.g., Perceived Stress Scale)",
          "Counseling on stress management",
        ],
        "5th ANC Visit – Late Pregnancy Monitoring": [
          "Reassess stress level",
          "Monitor impact on pregnancy",
        ],
      },
      supplementalVisits: [
        {
          title: "Stress Management",
          relativeTo: "2nd ANC Visit – Early Pregnancy Assessment",
          offsetWeeks: 6, // 16 + 6 = 22 weeks
          purpose: "Reduce maternal stress",
          details: [
            "Stress assessment",
            "Mindfulness or relaxation session",
            "Counseling on work-life balance",
          ],
          frequency: "Every 6 weeks", // 22, 28, 34
        },
      ],
    },
    previousComplications: {
      enhancements: {
        "1st ANC Visit – Booking Visit": [
          "Detailed review of previous complications (e.g., preterm birth, miscarriage)",
          "Risk stratification for recurrence",
          "Counseling on monitoring plan",
        ],
        "4th ANC Visit – Mid-Pregnancy Screening": [
          "Monitor for recurrence of past issues (e.g., cervical length if prior preterm)",
          "Adjust care based on history",
        ],
        "6th ANC Visit – Pre-Labor Assessment": [
          "Assess risk of recurrence near term",
          "Plan delivery method if indicated (e.g., cesarean for prior stillbirth)",
        ],
      },
      supplementalVisits: [
        {
          title: "Complication Monitoring",
          relativeTo: "1st ANC Visit – Booking Visit",
          offsetWeeks: 6, // 12 + 6 = 18 weeks
          purpose: "Monitor for recurrence of previous complications",
          details: [
            "Targeted ultrasound (e.g., cervical length, placental health)",
            "Symptom review based on history",
            "Counseling on risk mitigation",
          ],
          frequency: "Every 6 weeks", // 18, 24, 30, 36
        },
      ],
    },
    parity: {
      // High parity (e.g., >4) increases risks like uterine rupture, postpartum hemorrhage
      enhancements: {
        "1st ANC Visit – Booking Visit": [
          "Assess parity and obstetric history",
          "Counseling on risks if parity > 4",
        ],
        "5th ANC Visit – Late Pregnancy Monitoring": [
          "Monitor uterine tone and fetal growth",
          "Plan delivery for high-parity risks",
        ],
        "7th ANC Visit – Final Pre-Labor Check": [
          "Assess for signs of uterine strain",
          "Confirm hospital delivery for multiparous mothers",
        ],
      },
      supplementalVisits: [
        {
          title: "High Parity Check",
          relativeTo: "1st ANC Visit – Booking Visit",
          offsetWeeks: 10, // 12 + 10 = 22 weeks (if parity > 4)
          purpose: "Monitor risks associated with high parity",
          details: [
            "Ultrasound for placental health",
            "BP and symptom check",
            "Counseling on labor risks",
          ],
          frequency: "Every 8 weeks", // 22, 30, 38 (if parity > 4)
        },
      ],
    },
    gravidity: {
      // High gravidity (e.g., >5) increases risks like anemia, placenta previa
      enhancements: {
        "1st ANC Visit – Booking Visit": [
          "Assess gravidity and pregnancy history",
          "Counseling on risks if gravidity > 5",
        ],
        "3rd ANC Visit – Fetal Growth Check": [
          "Monitor for placenta previa or anemia",
          "Adjust supplementation if needed",
        ],
        "6th ANC Visit – Pre-Labor Assessment": [
          "Final check for gravidity-related complications",
          "Plan delivery logistics",
        ],
      },
      supplementalVisits: [
        {
          title: "High Gravidity Check",
          relativeTo: "1st ANC Visit – Booking Visit",
          offsetWeeks: 10, // 12 + 10 = 22 weeks (if gravidity > 5)
          purpose: "Monitor risks associated with high gravidity",
          details: [
            "Ultrasound for placental position",
            "Hemoglobin check",
            "Counseling on fatigue and nutrition",
          ],
          frequency: "Every 8 weeks", // 22, 30, 38 (if gravidity > 5)
        },
      ],
    },
  },
};