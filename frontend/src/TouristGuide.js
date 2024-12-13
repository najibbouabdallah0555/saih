import React from 'react';

const TouristGuide = () => {
  // Example data for tourist guides
  const guides = [
    {
      id: 1,
      name: 'John Doe',
      image: 'https://via.placeholder.com/150',
      bio: 'Experienced guide specializing in cultural and historical tours. Fluent in English and French.',
      contact: 'mailto:john.doe@example.com',
    },
    {
      id: 2,
      name: 'Sarah Smith',
      image: 'https://via.placeholder.com/150',
      bio: 'Nature enthusiast offering eco-friendly and adventure tours in the mountains.',
      contact: 'mailto:sarah.smith@example.com',
    },
    {
      id: 3,
      name: 'Ali Ahmed',
      image: 'https://via.placeholder.com/150',
      bio: 'Expert in Middle Eastern travel, offering personalized and group tour experiences.',
      contact: 'mailto:ali.ahmed@example.com',
    },
    {
      id: 4,
      name: 'Emily Johnson',
      image: 'https://via.placeholder.com/150',
      bio: 'Specialist in culinary tours, helping you explore the world through food and wine.',
      contact: 'mailto:emily.johnson@example.com',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[rgb(0,176,176)] text-white py-6 text-center">
        <h1 className="text-3xl font-bold">Tourist Guides</h1>
        <p className="text-lg mt-2">Explore our professional guides to make your journey memorable.</p>
      </header>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {guides.map((guide) => (
          <div key={guide.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition duration-300">
            <img
              src={guide.image}
              alt={guide.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800">{guide.name}</h2>
            <p className="text-gray-600 my-2">{guide.bio}</p>
            <a
              href={guide.contact}
              className="bg-[rgb(0,176,176)] text-white px-4 py-2 rounded mt-4 inline-block hover:bg-[rgb(0,146,146)]"
            >
              Contact
            </a>
          </div>
        ))}
      </div>
      <footer className="bg-black text-[rgb(0,176,176)] py-4 text-center">
        <p>&copy; 2024 Halal Travel Agency. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default TouristGuide;
