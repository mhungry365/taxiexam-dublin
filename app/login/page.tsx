import { AuthForm } from "@/components/taxiexam/auth-form";

export const metadata = {
  title: "Login"
};

export default function LoginPage() {
  return (
    <section className="section bg-snow">
      <div className="container">
        <AuthForm mode="login" />
      </div>
    </section>
  );
}
