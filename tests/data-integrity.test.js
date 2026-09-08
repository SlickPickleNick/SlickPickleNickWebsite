/**
 * Data Integrity Test Suite
 * Validates schemas, uniqueness, and format for all JSON data assets:
 * - assets/data/commands.json
 * - assets/data/rewards.json
 * - assets/data/schedule.json
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

describe('Data Integrity & Schema Validation', () => {

  describe('commands.json', () => {
    const commandsPath = path.join(rootDir, 'assets', 'data', 'commands.json');

    it('should exist and be valid JSON', () => {
      assert.ok(fs.existsSync(commandsPath), 'commands.json must exist');
      const raw = fs.readFileSync(commandsPath, 'utf8');
      const data = JSON.parse(raw);
      assert.ok(Array.isArray(data), 'commands.json must contain an array');
      assert.ok(data.length > 0, 'commands.json should have at least 1 command');
    });

    it('should have valid schema on each command entry', () => {
      const data = JSON.parse(fs.readFileSync(commandsPath, 'utf8'));
      const validCategories = ['General', 'Socials', 'Spotify', 'Loyalty', 'Torch Game', 'Games'];
      const seenCommands = new Set();

      data.forEach((cmd, index) => {
        assert.ok(cmd.command && typeof cmd.command === 'string', `Entry ${index} must have 'command' string`);
        assert.ok(cmd.command.startsWith('!'), `Entry ${index} (${cmd.command}) must start with '!'`);
        
        // Check uniqueness of base command
        const baseCmd = cmd.command.split(' ')[0].toLowerCase();
        assert.ok(!seenCommands.has(baseCmd), `Duplicate base command found: ${baseCmd}`);
        seenCommands.add(baseCmd);

        assert.ok(cmd.category && typeof cmd.category === 'string', `Entry ${cmd.command} must have 'category'`);
        assert.ok(validCategories.includes(cmd.category), `Entry ${cmd.command} has unknown category '${cmd.category}'`);

        assert.ok(cmd.description && typeof cmd.description === 'string', `Entry ${cmd.command} must have 'description'`);
        assert.ok(cmd.example && typeof cmd.example === 'string', `Entry ${cmd.command} must have 'example'`);
        assert.ok(cmd.cooldown && typeof cmd.cooldown === 'string', `Entry ${cmd.command} must have 'cooldown'`);
      });
    });
  });

  describe('rewards.json', () => {
    const rewardsPath = path.join(rootDir, 'assets', 'data', 'rewards.json');

    it('should exist and be valid JSON', () => {
      assert.ok(fs.existsSync(rewardsPath), 'rewards.json must exist');
      const raw = fs.readFileSync(rewardsPath, 'utf8');
      const data = JSON.parse(raw);
      assert.ok(Array.isArray(data), 'rewards.json must contain an array');
      assert.ok(data.length > 0, 'rewards.json should have at least 1 reward');
    });

    it('should have valid schema and unique IDs on each reward entry', () => {
      const data = JSON.parse(fs.readFileSync(rewardsPath, 'utf8'));
      const seenIds = new Set();
      const validStatuses = ['Active', 'Paused'];

      data.forEach((reward, index) => {
        assert.ok(reward.id && typeof reward.id === 'string', `Reward ${index} must have 'id' string`);
        assert.ok(!seenIds.has(reward.id), `Duplicate reward id: ${reward.id}`);
        seenIds.add(reward.id);

        assert.ok(reward.title && typeof reward.title === 'string', `Reward ${reward.id} must have 'title'`);
        assert.ok(typeof reward.cost === 'number' && reward.cost > 0, `Reward ${reward.id} must have positive numeric 'cost'`);
        assert.ok(reward.category && typeof reward.category === 'string', `Reward ${reward.id} must have 'category'`);
        assert.ok(reward.description && typeof reward.description === 'string', `Reward ${reward.id} must have 'description'`);
        assert.ok(reward.cooldown && typeof reward.cooldown === 'string', `Reward ${reward.id} must have 'cooldown'`);
        assert.ok(validStatuses.includes(reward.status), `Reward ${reward.id} has invalid status '${reward.status}'`);
      });
    });
  });

  describe('schedule.json', () => {
    const schedulePath = path.join(rootDir, 'assets', 'data', 'schedule.json');

    it('should exist and be valid JSON', () => {
      assert.ok(fs.existsSync(schedulePath), 'schedule.json must exist');
      const raw = fs.readFileSync(schedulePath, 'utf8');
      const data = JSON.parse(raw);
      assert.ok(Array.isArray(data), 'schedule.json must contain an array');
      assert.ok(data.length > 0, 'schedule.json should have at least 1 stream');
    });

    it('should have valid stream schedule schema', () => {
      const data = JSON.parse(fs.readFileSync(schedulePath, 'utf8'));
      const seenIds = new Set();

      data.forEach((item, index) => {
        assert.ok(item.id && typeof item.id === 'string', `Schedule entry ${index} must have 'id'`);
        assert.ok(!seenIds.has(item.id), `Duplicate schedule id: ${item.id}`);
        seenIds.add(item.id);

        assert.ok(item.title && typeof item.title === 'string', `Schedule ${item.id} must have 'title'`);
        assert.ok(item.game && typeof item.game === 'string', `Schedule ${item.id} must have 'game'`);
        assert.ok(typeof item.hour === 'number' && item.hour >= 0 && item.hour <= 23, `Schedule ${item.id} hour must be 0-23`);
        assert.ok(typeof item.minute === 'number' && item.minute >= 0 && item.minute <= 59, `Schedule ${item.id} minute must be 0-59`);
        assert.ok(typeof item.durationHours === 'number' && item.durationHours > 0, `Schedule ${item.id} durationHours must be > 0`);
      });
    });
  });

});
