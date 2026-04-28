// API Communication

const API = {
  baseURL: '/api',

  async getAlgorithms() {
    try {
      const response = await fetch(`${this.baseURL}/algorithms`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching algorithms:', error);
    }
  },

  async simulate(algorithm, pageSequence, frameSize) {
    try {
      const response = await fetch(`${this.baseURL}/simulate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          algorithm,
          pageSequence,
          frameSize
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Error running simulation:', error);
      throw error;
    }
  },

  async compareAlgorithms(pageSequence, frameSize) {
    try {
      const response = await fetch(`${this.baseURL}/compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pageSequence,
          frameSize
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Error comparing algorithms:', error);
      throw error;
    }
  }
};
