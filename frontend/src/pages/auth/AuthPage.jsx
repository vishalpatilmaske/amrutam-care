import AyurvedaSide from "./AyurvedaSide";
import AuthForm from "./AuthForm";

export default function AmrutamCareAuth() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-green-200 via-yellow-100 to-yellow-300 items-center justify-center">
      <div className="md:w-1/2 w-full h-[300px] md:h-auto flex">
        <AyurvedaSide />
      </div>
      <div className="md:w-1/2 w-full flex items-center justify-center">
        <AuthForm />
      </div>
    </div>
  );
}
