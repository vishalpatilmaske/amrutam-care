import herbs from "../../assets/image/herbs.png";
import mortar from "../../assets/image/mortar-pestle.png";
import ayourveda from "../../assets/image/ayurveda.png";

export default function AyurvedaSide() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-gradient-to-br from-green-200 via-yellow-100">
      <img
        src={ayourveda}
        alt="Amrutam Care Logo"
        className="w-24 h-24 mb-6 rounded-full shadow-lg"
      />
      <h1 className="text-4xl font-extrabold text-green-800 mb-3 drop-shadow-lg">
        Amrutam Care
      </h1>
      <p className="text-lg text-green-900 mb-4 text-center">
        <span className="font-semibold">
          Ayurveda for personalized wellness.
        </span>{" "}
        Explore holistic healing, herbal remedies, and expert care.
      </p>
      <div className="flex gap-6 mt-8">
        <img src={herbs} alt="Herbs Icon" className="w-12 h-12" />
        <img src={mortar} alt="Mortar Pestle Icon" className="w-12 h-12" />
        {/* If you want another icon, you can use herbs again or any other PNG */}
        {/* <img src={herbs} alt="Herbs Icon" className="w-12 h-12" /> */}
      </div>
      <span className="mt-8 text-md text-yellow-700 italic">
        Empower your health, naturally.
      </span>
    </div>
  );
}
