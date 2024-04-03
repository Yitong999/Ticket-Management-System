export class Supervisor {
    constructor(name) {
      this.name = name;
      this.tickets_map = new Map(); // key is speed chart, value is a list of tickets
    }
  
    // Method to add a speed chart with its corresponding couple of tickets
    addSpeedChart(speedChart, ticket) {
      //
      this.tickets_map[speedChart].push(ticket)

      // Check if the speed chart already exists in the map
      if (!this.tickets_map.has(speedChart)) {
        // If not, initialize it with an empty array
        this.tickets_map.set(speedChart, []);
      }
      // Add the ticket to the corresponding speed chart
      this.tickets_map.get(speedChart).push(ticket);
    }
  
    // Method to get all speed charts and their corresponding tickets
    getSpeedCharts() {
        return Array.from(this.tickets_map.entries());
    }
  }
  