import { useState, useEffect } from 'react';
import axios from 'axios';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [type, setType] = useState('expense');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState('');
    const [description, setDescription] = useState('');
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No token found");
            return;
        }
        try {
            const res = await axios.get('http://localhost:5000/api/transactions', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTransactions(res.data);
        } catch (error) {
            console.error("Error fetching transactions:", error.response?.data || error.message);
        }
    };
    
    const handleAddOrUpdateTransaction = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No token found");
            return;
        }
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const transactionData = { type, amount, category, tags: tags.split(','), description };
    
        try {
            if (editingId) {
                await axios.put(`http://localhost:5000/api/transactions/${editingId}`, transactionData, config);
                setEditingId(null);
            } else {
                await axios.post('http://localhost:5000/api/transactions', transactionData, config);
            }
            setType('expense');
            setAmount('');
            setCategory('');
            setTags('');
            setDescription('');
            fetchTransactions();
        } catch (error) {
            console.error("Error adding/updating transaction:", error.response?.data || error.message);
        }
    };
    
    const handleEdit = (transaction) => {
        setEditingId(transaction._id);
        setType(transaction.type);
        setAmount(transaction.amount);
        setCategory(transaction.category);
        setTags(transaction.tags.join(', '));
        setDescription(transaction.description);
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/transactions/${id}`, {
            headers: { Authorization: token }
        });
        fetchTransactions();
    };

    return (
        <div className="p-4 bg-gray-100 rounded-md mt-4">
            <h2 className="text-xl font-bold mb-4">Transactions</h2>
            <form onSubmit={handleAddOrUpdateTransaction} className="flex gap-2 mb-4">
                <select className="border p-2 rounded" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                </select>
                <input className="border p-2 rounded" type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                <input className="border p-2 rounded" type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
                <input className="border p-2 rounded" type="text" placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
                <input className="border p-2 rounded" type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">{editingId ? 'Update' : 'Add'}</button>
            </form>
            <ul>
                {transactions.map((transaction) => (
                    <li key={transaction._id} className="bg-white p-3 rounded-md shadow-md flex justify-between mb-2">
                        <span>{transaction.type.toUpperCase()} - ${transaction.amount} ({transaction.category})</span>
                        <div>
                            <button className="text-blue-500 mr-2" onClick={() => handleEdit(transaction)}>Edit</button>
                            <button className="text-red-500" onClick={() => handleDelete(transaction._id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Transactions;
