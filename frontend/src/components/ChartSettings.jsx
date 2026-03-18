import { useState } from "react";
import { motion } from "framer-motion";

function ChartSettings({ widget, onUpdate }) {
    const [title, setTitle] = useState(widget.title || "");

    function save() {
        onUpdate({
            ...widget,
            title
        });
    }

    return (
        <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full md:w-80 bg-gradient-to-b from-white to-gray-50 shadow-2xl p-6 overflow-y-auto"
        >
            <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="text-2xl font-bold mb-6 text-gray-800"
            >
                Chart Settings
            </motion.h2>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="mb-6"
            >
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Title
                </label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter chart title"
                />
            </motion.div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={save}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
                Save Changes
            </motion.button>
        </motion.div>
    );
}

export default ChartSettings;