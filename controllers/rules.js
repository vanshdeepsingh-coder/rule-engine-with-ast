const Rule = require('../models/Rule');
const { parseRuleString, combineNodes, evaluate,printTree } = require('../utils/ast');

const createRuleMethod = async (req, res) => {
  try {
    const { ruleName, ruleString } = req.body;
    if (!ruleName || !ruleString) {
      return res.status(400).json({ error: 'ruleName and ruleString are required' });
    }
    const rootNode = parseRuleString(ruleString);
    const rule = new Rule({ ruleName, ruleAST: rootNode });
    await rule.save();
    printTree(rootNode);
    res.status(201).json(rule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const combineRulesMethod = async (req, res) => {
  try {
    const { rules ,op} = req.body;
    const ruleDocs = await Rule.find({ ruleName: { $in: rules } });
    if (ruleDocs.length === 0) {
      return res.status(404).json({ error: 'No matching rules found' });
    }
    const ruleASTs = ruleDocs.map(rule => rule.ruleAST);
    const combinedRootNode = combineNodes(ruleASTs,op);
    const randomString = generateRandomCharacterString(4);
    const rule = new Rule({ ruleName: `combined${randomString}`, ruleAST: combinedRootNode });
    await rule.save();
    printTree(combinedRootNode);
    res.status(201).json(rule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

function generateRandomCharacterString(length) {
  const totalAlphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let answer = '';
  const alphabetsLength = totalAlphabets.length;

  for (let i = 0; i < length; i++) {
      const indexRandom = Math.floor(Math.random() * alphabetsLength);
      answer += totalAlphabets.charAt(indexRandom);
  }

  return answer;
}

const evaluateRuleMethod = async (req, res) => {
  try {
    const { ast, data } = req.body;
    const rule = await Rule.find({ruleName: ast});

    if (!rule) {
      return res.status(404).json({ error: 'Rule not found' });
    }
    const result = evaluate(rule[0].ruleAST, data);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports={createRuleMethod, combineRulesMethod, evaluateRuleMethod};