import OTPForm from "@/components/OTPForm";

export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div className="flex justify-center p-6">
      <OTPForm />
    </div>
  );
}
