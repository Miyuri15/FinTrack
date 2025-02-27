import React from "react";

const BudgetRecommendations = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-6">
        Budget Planning Recommendations
      </h2>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Tips for Effective Budgeting</h3>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
          <li className="mb-2">Track your expenses regularly.</li>
          <li className="mb-2">Set realistic financial goals.</li>
          <li className="mb-2">Allocate funds for savings and emergencies.</li>
          <li className="mb-2">Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings.</li>
          <li className="mb-2">Review and adjust your budget monthly.</li>
        </ul>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Common Budgeting Mistakes to Avoid</h3>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
            <li className="mb-2">Not accounting for irregular expenses (e.g., car repairs, medical bills).</li>
            <li className="mb-2">Underestimating discretionary spending.</li>
            <li className="mb-2">Setting too aggressive savings goals, leaving no room for flexibility.</li>
            <li className="mb-2">Failing to review your budget regularly.</li>
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Interactive Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
              <h4 className="font-semibold">Expense Tracker</h4>
              <p className="text-sm">Track your daily expenses and categorize them.</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
              <h4 className="font-semibold">Savings Calculator</h4>
              <p className="text-sm">Calculate how much you need to save for your goals.</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Additional Resources</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Explore these resources to deepen your budgeting knowledge and improve your financial planning:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-4">
            <li className="mb-2">Budgeting for Beginners (Article)</li>
            <li className="mb-2">Free Budgeting Workshops (Webinars)</li>
            <li className="mb-2">Financial Planning Tools (Websites)</li>
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Budgeting Templates</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Download these templates to kickstart your budgeting journey:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
              <h4 className="font-semibold">Monthly Budget Template</h4>
              <p className="text-sm">A simple template to manage your monthly expenses.</p>
              <button className="text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 mt-2 rounded-lg">Download</button>
            </div>
            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
              <h4 className="font-semibold">Annual Budget Planner</h4>
              <p className="text-sm">A yearly template to track long-term financial goals.</p>
              <button className="text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 mt-2 rounded-lg">Download</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetRecommendations;
