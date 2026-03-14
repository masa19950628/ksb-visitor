import Link from "next/link";

export default function Header() {
    return (
        <header className="app-header">
            <Link href="/" className="brand-title">
                ✨ KSB練習ビジター申し込み
            </Link>
            <nav>
                <Link href="/admin" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                    管理者ページへ
                </Link>
            </nav>
        </header>
    );
}
