import Layout from "../Layout";
import MenuBar from "../MenuBar";
import Navbar from "../Navbar";

export default function AdminTransactions(isAdmin , username){
    return <>
        <div className="flex min-h-screen bg-background-light dark:bg-gray-900 text-text-light dark:text-white">
      <MenuBar isAdmin={isAdmin} />
      <div className="flex-grow">
        <Navbar username={username} />
        <div className="p-8">
    <h1>Hello from Admin Transactions</h1>
    </div>
    </div>
    </div>
    </>
}