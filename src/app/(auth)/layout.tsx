export const metadata = {
  title: "Login - GrowthOS",
  description: "Sign in or create your GrowthOS account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="flex min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
