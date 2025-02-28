import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditTransactionForm = ({ transaction, onClose, onUpdate }) => {
    const [editedTransaction, setEditedTransaction] = useState({ ...transaction });
    const [error, setError] = useState('');
    
    useEffect(() => {
        setEditedTransaction({ ...transaction });
    }, [transaction]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedData = {
                ...editedTransaction,
                recurrencePattern: editedTransaction.isRecurring 
                    ? editedTransaction.recurrencePattern 
                    : undefined
            };
            
            await onUpdate(transaction._id, updatedData);
            onClose();
        } catch (err) {
            setError('Failed to update transaction');
            console.error('Update Error:', err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-medium mb-4 text-gray-900 dark:text-white">Edit Transaction</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <select
                        value={editedTransaction.type}
                        onChange={(e) => setEditedTransaction({ ...editedTransaction, type: e.target.value })}
                        className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>

                    <input
                        type="number"
                        placeholder="Amount"
                        value={editedTransaction.amount}
                        onChange={(e) => setEditedTransaction({ ...editedTransaction, amount: e.target.value })}
                        className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />

                    <input
                        type="text"
                        placeholder="Category"
                        value={editedTransaction.category}
                        onChange={(e) => setEditedTransaction({ ...editedTransaction, category: e.target.value })}
                        className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />

                    <input
                        type="text"
                        placeholder="Description"
                        value={editedTransaction.description}
                        onChange={(e) => setEditedTransaction({ ...editedTransaction, description: e.target.value })}
                        className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />

                    <input
                        type="text"
                        placeholder="Tags (comma-separated)"
                        value={editedTransaction.tags.join(',')}
                        onChange={(e) => setEditedTransaction({ 
                            ...editedTransaction, 
                            tags: e.target.value.split(',').map(tag => tag.trim()) 
                        })}
                        className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />

                    <label className="flex items-center gap-2 text-gray-900 dark:text-white">
                        <input
                            type="checkbox"
                            checked={editedTransaction.isRecurring}
                            onChange={(e) => setEditedTransaction({ 
                                ...editedTransaction, 
                                isRecurring: e.target.checked 
                            })}
                            className="border border-gray-300 dark:border-gray-600"
                        />
                        <span>Recurring Transaction</span>
                    </label>

                    {editedTransaction.isRecurring && (
                        <div className="space-y-2">
                            <select
                                value={editedTransaction.recurrencePattern?.frequency || 'monthly'}
                                onChange={(e) => setEditedTransaction({
                                    ...editedTransaction,
                                    recurrencePattern: {
                                        ...editedTransaction.recurrencePattern,
                                        frequency: e.target.value
                                    }
                                })}
                                className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>

                            <input
                                type="date"
                                value={editedTransaction.recurrencePattern?.endDate || ''}
                                onChange={(e) => setEditedTransaction({
                                    ...editedTransaction,
                                    recurrencePattern: {
                                        ...editedTransaction.recurrencePattern,
                                        endDate: e.target.value
                                    }
                                })}
                                className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                    )}

                    {error && <p className="text-red-500">{error}</p>}

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTransactionForm;