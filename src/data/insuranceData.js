const insurancePlans = [
  {
    id: "plan_oro",
    name: "Plan Oro Premium",
    coverage: {
      "Cardiología": { coPay: 20, discount: 0.8 },
      "Pediatría": { coPay: 15, discount: 0.9 },
      "Medicina General": { coPay: 10, discount: 1.0 },
      "Traumatología": { coPay: 25, discount: 0.75 },
      "Gastroenterología": { coPay: 20, discount: 0.8 }
    }
  },
  {
    id: "plan_plata",
    name: "Plan Plata Standard",
    coverage: {
      "Cardiología": { coPay: 40, discount: 0.6 },
      "Pediatría": { coPay: 30, discount: 0.7 },
      "Medicina General": { coPay: 20, discount: 0.8 },
      "Traumatología": { coPay: 50, discount: 0.5 },
      "Gastroenterología": { coPay: 40, discount: 0.6 }
    }
  }
];

const hospitalNetwork = [
  {
    id: "hosp_central",
    name: "Hospital Central",
    location: "Centro",
    baseCosts: {
      "Cardiología": 100,
      "Pediatría": 80,
      "Medicina General": 50,
      "Traumatología": 120,
      "Gastroenterología": 110
    }
  },
  {
    id: "hosp_norte",
    name: "Clínica del Norte",
    location: "Norte",
    baseCosts: {
      "Cardiología": 90,
      "Pediatría": 70,
      "Medicina General": 45,
      "Traumatología": 110,
      "Gastroenterología": 100
    }
  },
  {
    id: "hosp_sur",
    name: "Centro Médico Sur",
    location: "Sur",
    baseCosts: {
      "Cardiología": 110,
      "Pediatría": 90,
      "Medicina General": 60,
      "Traumatología": 130,
      "Gastroenterología": 120
    }
  }
];

module.exports = { insurancePlans, hospitalNetwork };
