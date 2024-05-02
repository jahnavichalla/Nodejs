const assert = require('assert');
const { retrievePassword, deleteDocument } = require('./Retrieve_Delete.js');

describe('Testing', () => {
  describe('retrievePassword', () => {
    it('should retrieve password and check length', async function() {
      this.timeout(10000); // Set timeout to 10 seconds (10000ms)

      // Get the username from the terminal command
      const username = process.argv[2];

      if (!username) {
        throw new Error('Please provide a username as a command-line argument');
      }

      // Call the deleteDocument function to retrieve the password
      const password = await deleteDocument(username);
      console.log(password);

      // Check if the returned password is not null
      if (password !== null) {
        // Check if password length is greater than 8
        assert.strictEqual(password.length >= 8, true, 'Password length is greater than 8 characters');
      } else {
        // If the password is null, throw an error
        throw new Error('User with Username ${username} doesnt exist');
      }
    });
  });
});