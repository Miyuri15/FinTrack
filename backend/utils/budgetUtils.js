const analyzeSpendingTrends = (transactions, budgets) => {
    const spendingByCategory = {};
  
    // Calculate total spending per category across all months
    transactions.forEach((transaction) => {
      const { category, amount, month } = transaction;
      if (!spendingByCategory[category]) {
        spendingByCategory[category] = { totalSpent: 0, months: {} };
      }
      if (!spendingByCategory[category].months[month]) {
        spendingByCategory[category].months[month] = 0;
      }
      spendingByCategory[category].totalSpent += amount;
      spendingByCategory[category].months[month] += amount;
    });
  
    // Compare spending to budget and generate recommendations
    const recommendations = [];
    budgets.forEach((budget) => {
      const { category, limit, month } = budget;
      const totalSpent = spendingByCategory[category]?.months[month] || 0;
      const percentageUsed = (totalSpent / limit) * 100;
  
      if (percentageUsed > 100) {
        recommendations.push({
          category,
          month,
          message: `In ${month}, you exceeded your ${category} budget by ${(percentageUsed - 100).toFixed(2)}%. Consider increasing your budget or reducing spending.`,
        });
      } else if (percentageUsed < 80) {
        recommendations.push({
          category,
          month,
          message: `In ${month}, you used only ${percentageUsed.toFixed(2)}% of your ${category} budget. Consider reallocating funds to other categories.`,
        });
      }
    });
  
    return recommendations;
  };