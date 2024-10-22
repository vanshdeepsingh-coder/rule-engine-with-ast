const express = require('express');
const router = express.Router();
const rules = require('../controllers/rules');

router.post('/create_rule', rules.createRuleMethod);
router.post('/combine_rules', rules.combineRulesMethod);
router.post('/evaluate_rule', rules.evaluateRuleMethod);

module.exports = router;
