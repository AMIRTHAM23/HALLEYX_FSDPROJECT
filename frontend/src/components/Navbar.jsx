import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Navbar({ user, onLogout }) {
    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-amber-700 to-stone-700 shadow-lg p-4 flex flex-col md:flex-row justify-between items-center"
        >
            <motion.h1
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-2xl font-bold text-white mb-4 md:mb-0"
            >
                Halleyx Dashboard
            </motion.h1>

            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-5">
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-5">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link to="/" className="text-white hover:text-amber-200 transition-colors duration-200">Dashboard</Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link to="/configure" className="text-white hover:text-amber-200 transition-colors duration-200">Configure</Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link to="/orders" className="text-white hover:text-amber-200 transition-colors duration-200">Orders</Link>
                    </motion.div>
                    {user?.role === "admin" && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link to="/admin/users" className="text-white hover:text-amber-200 transition-colors duration-200">Users</Link>
                        </motion.div>
                    )}
                </div>

                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 ml-0 md:ml-8 md:pl-8 border-t md:border-t-0 md:border-l border-white/20 pt-4 md:pt-0">
                    <span className="text-sm text-white/90">
                        Welcome, {user?.username || 'User'}
                    </span>
                    <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
                        {user?.role || 'user'}
                    </span>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onLogout}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded-full transition-colors duration-200"
                    >
                        Logout
                    </motion.button>
                </div>
            </div>
        </motion.nav>
    );
}

export default Navbar;
