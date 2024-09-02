import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import GoogleLogo from "../../public/google.svg";
import { signIn } from "@/auth";

const AuthForm = () => {
  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link
          href="/"
          className="cursor-pointer items-center justify-center gap-1 flex"
        >
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1 text-center">
            AI Drawing Game
          </h1>
        </Link>

        <div className="flex flex-col gap-1 md:gap-3">
          <form
            className="flex flex-col gap-1 md:gap-3"
            action={async () => {
              "use server";
              await signIn("github", {
                redirectTo: "http://localhost:3000",
              });
            }}
          >
            <Button
              type="submit"
              className="text-16 bg-gray-400 hover:bg-slate-300"
            >
              Github SignIn
            </Button>
          </form>

          <form
            className="flex flex-col gap-1 md:gap-3"
            action={async () => {
              "use server";
              await signIn("google", {
                redirectTo: "http://localhost:3000",
              });
            }}
          >
            <Button
              type="submit"
              className="text-16 bg-gray-400 hover:bg-slate-300"
            >
              Google SignIn
            </Button>
          </form>
        </div>
      </header>
      <footer className="flex justify-center gap-1">
        <p className="text-14 font-noral text-gray-600">By Hassan Alti</p>
      </footer>
    </section>
  );
};
export default AuthForm;
