import Link from "next/link";

export default function Header() {
    return (
        <header className="app-header">
            <Link href="/" className="brand-title">
                ✨ KSB練習ビジター申し込みシステム
            </Link>
            <nav>
                <Link href="/admin/login" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                    管理者ログイン
                </Link>
            </nav>
        </header>
    );
}
