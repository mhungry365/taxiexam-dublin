import { AuthForm } from "@/components/taxiexam/auth-form";

export const metadata = {
  title: "Register"
};

export default function RegisterPage() {
  return (
    <section className="section bg-snow">
      <div className="container">
        <AuthForm mode="register" />
      </div>
    </section>
  );
}
