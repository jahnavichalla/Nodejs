// test.js
const assert = require('assert');
const { retrievePassword, reversePassword } = require('./retrieve');

describe('Integration Testing', () => {
  describe('retrievePassword Integration with reversePassword', () => {
    const user = { name: 'jahnavi', password: '12' };

    const findOneStub = async (username) => {
      if (username === 'jahnavi') {
        return user;
      } else {
        return null;
      }
    };

    it('should retrieve password and reverse it', async () => {
      const result = await retrievePassword('jahnavi', findOneStub);

      assert.strictEqual(result, reversePassword(user.password));
    });

    it('should handle user not found', async () => {
      const result = await retrievePassword('nonExistingUser', findOneStub);

      assert.strictEqual(result, null);
    });
  });
});



