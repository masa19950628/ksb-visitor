export default function Footer() {
    return (
        <footer className="mt-16 border-t py-8 text-center text-gray-500 text-sm">
            <div className="space-y-2">
                <div>© {new Date().getFullYear()} Masaya Sanor</div>

                <nav className="space-x-4">
                    <a href="/privacy" className="underline hover:text-gray-700">
                        プライバシーポリシー
                    </a>
                </nav>
            </div>
        </footer>
    );
}
