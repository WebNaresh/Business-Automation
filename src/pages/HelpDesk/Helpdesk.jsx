import React, { useState } from "react";

const categories = [
    {
        title: "Leave",
        description: "FAQs related to leave are shown here",
        faqs: [
            { question: "How to create a leave request?", answer: "Leave Management> Select Date > Submit > Select Leave type > Apply" },
            { question: "How to create leave types?", answer: "Branches > Setup > Leave > Fill Out Form" },
        ],
    },
    {
        title: "Attendance",
        description: "FAQs related to attendance are shown here",
        faqs: [
            { question: "How to mark attendance?", answer: "Leave Management> Select Date > Submit > Select Leave type > Apply" },
            { question: "How to view attendance reports?", answer: "Reports > Attendance > Filter by Date" },
        ],
    },
    {
        title: "Employee",
        description: "FAQs related to employee are shown here",
        faqs: [
            { question: "How to add a new employee?", answer: "Employee > Add New > Fill Out Form" },
            { question: "How to update employee details?", answer: "Employee > Search Employee > Update Details" },
        ],
    },
    {
        title: "Base",
        description: "FAQs related to base are shown here",
        faqs: [
            { question: "What is the base feature?", answer: "Base > Overview" },
            { question: "How to configure base settings?", answer: "Base > Settings > Configure Options" },
        ],
    },
    {
        title: "Recruitment",
        description: "FAQs related to recruitment are shown here",
        faqs: [
            { question: "How to post a job?", answer: "Recruitment > Job Postings > Add New Job" },
            { question: "How to track applicants?", answer: "Recruitment > Applicants > View Status" },
        ],
    },
    {
        title: "Payroll",
        description: "FAQs related to payroll are shown here",
        faqs: [
            { question: "How to process payroll?", answer: "Payroll > Process > Review & Approve" },
            { question: "How to view salary slips?", answer: "Payroll > Salary Slips > Select Month" },
        ],
    },
];

const HelpDesk = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedFaq, setSelectedFaq] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredFaqs, setFilteredFaqs] = useState([]);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        if (query) {
            // Filter FAQs across all categories
            const allFaqs = categories.flatMap((category) =>
                category.faqs.map((faq) => ({
                    ...faq,
                    category: category.title, // Add category title for context
                }))
            );

            const filtered = allFaqs.filter(
                (faq) =>
                    faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query)
            );

            setFilteredFaqs(filtered);
        } else {
            setFilteredFaqs([]);
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">FAQ Categories</h1>
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        value={searchQuery} 
                        onChange={handleSearch}
                        placeholder="Search in FAQs..."
                        className="p-2 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 "
                    />
                </div>
            </div>

            {/* Show Search Results */}
            {searchQuery && filteredFaqs.length > 0 ? (
                <div>
                    <h2 className="text-xl font-bold mb-4">Search Results</h2>
                    <ul className="space-y-4">
                        {filteredFaqs.map((faq, index) => (
                            <li
                                key={index}
                                className="bg-white p-4 rounded-md shadow-md hover:shadow-lg cursor-pointer"
                                onClick={() => setSelectedFaq(faq)}
                            >
                                <p className="font-semibold">{faq.question}</p>
                                <p className="text-gray-500 text-sm">{faq.category}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : searchQuery && filteredFaqs.length === 0 ? (
                <p className="text-gray-500">No results found for "{searchQuery}"</p>
            ) : selectedFaq ? (
                /* Show FAQ Answer */
                <div>
                    <button
                        onClick={() => setSelectedFaq(null)}
                        className="mb-4 bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
                    >
                        Back to FAQs
                    </button>
                    <h2 className="text-xl font-bold mb-4">{selectedFaq.question}</h2>
                    <p className="bg-white p-4 rounded-md shadow-md">{selectedFaq.answer}</p>
                </div>
            ) : selectedCategory ? (
                /* Show FAQs for Selected Category */
                <div>
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className="mb-4 bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
                    >
                        Back to Categories
                    </button>
                    <h2 className="text-xl font-bold mb-4">{selectedCategory.title} FAQs</h2>
                    <ul className="space-y-4">
                        {selectedCategory.faqs.map((faq, index) => (
                            <li
                                key={index}
                                className="bg-white p-4 rounded-md shadow-md hover:shadow-lg cursor-pointer"
                                onClick={() => setSelectedFaq(faq)}
                            >
                                {faq.question}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                /* Show FAQ Categories Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-md rounded-md p-6 text-center hover:shadow-lg transition-shadow"
                        >
                            <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
                            <p className="text-gray-600 mb-4">{category.description}</p>
                            <button
                                onClick={() => setSelectedCategory(category)}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                            >
                                View FAQs
                            </button>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HelpDesk;
