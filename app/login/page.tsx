import { redirect } from "next/navigation";
import { auth } from "../lib/auth";
import { GoogleSignInButton } from "../components/auth/GoogleSignInButton";

export default async function LoginPage() {
  // 既にログイン済みならトップページへリダイレクト
  const session = await auth();
  if (session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">ログイン</h1>
          <p className="mt-2 text-gray-600">TODO管理アプリにログイン</p>
        </div>

        <GoogleSignInButton />

        <p className="mt-6 text-center text-sm text-gray-500">
          ログインすると、タスクを管理できます
        </p>
      </div>
    </div>
  );
}
