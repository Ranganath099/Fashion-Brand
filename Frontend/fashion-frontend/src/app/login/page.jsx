// import OTPForm from "@/components/OTPForm";

// export const metadata = {
//   title: "Login",
// };

// export default function LoginPage() {
//   return (
//     <div className="flex justify-center p-6">
//       <OTPForm />
//     </div>
//   );
// }
import { Suspense } from "react";
import OTPForm from "@/components/OTPForm";

export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div className="flex justify-center p-6">
      <Suspense fallback={<div>Loading...</div>}>
        <OTPForm />
      </Suspense>
    </div>
  );
}