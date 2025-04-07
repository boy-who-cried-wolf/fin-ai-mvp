const { spawn } = require('child_process');
const path = require('path');

class FinancialAdvisorWrapper {
  constructor() {
    this.pythonProcess = spawn('python', [path.join(__dirname, 'main.py')]);
    this.pythonProcess.stdout.on('data', (data) => {
      console.log(`Python stdout: ${data}`);
    });
    this.pythonProcess.stderr.on('data', (data) => {
      console.error(`Python stderr: ${data}`);
    });
  }

  async analyzeFinances(transactions, userProfile) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({ transactions, userProfile });
      this.pythonProcess.stdin.write(data + '\n');
      this.pythonProcess.stdout.once('data', (data) => {
        try {
          const result = JSON.parse(data.toString());
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  async getHealth() {
    return new Promise((resolve, reject) => {
      this.pythonProcess.stdin.write('health\n');
      this.pythonProcess.stdout.once('data', (data) => {
        try {
          const result = JSON.parse(data.toString());
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}

module.exports = FinancialAdvisorWrapper; 