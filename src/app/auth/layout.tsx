export const metadata = {
    title: "Login",
    description: "Sign in to your account to access the dashboard and manage your application.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="xmax-w-md w-full space-y-8">
                {children}
            </div>
        </div>
    );
}