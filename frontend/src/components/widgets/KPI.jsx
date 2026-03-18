import { motion } from "framer-motion";

function KPI({ data }) {
    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
            className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg col-span-1 md:col-span-2 border border-gray-200 hover:border-blue-300 transition-all duration-300"
        >
            <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-gray-600 font-medium mb-2"
            >
                {data.title}
            </motion.h3>
            <motion.h1
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
                {data.value}
            </motion.h1>
        </motion.div>
    );
}

export default KPI;