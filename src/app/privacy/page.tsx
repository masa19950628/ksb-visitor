export default function PrivacyPolicyPage() {
    return (
        <PageContainer>
            <h1 className="text-3xl font-bold mb-6">プライバシーポリシー</h1>

            <p className="mb-4 leading-relaxed">
                KSB練習ビジター申し込みサイト（以下、「当サイト」）では、利用者の個人情報を適切に取り扱うため、
                以下の通りプライバシーポリシーを定めます。
            </p>

            <Section title="1. 収集する情報">
                <p className="mb-4 leading-relaxed">
                    当サイトでは、練習参加申し込みの際に以下の情報を収集します。
                </p>
                <ul className="list-disc ml-6 mb-4">
                    <li>氏名（代表者および同行者）</li>
                    <li>参加人数</li>
                    <li>パスワード（編集用）</li>
                </ul>
            </Section>

            <Section title="2. 利用目的">
                <p className="mb-4 leading-relaxed">収集した情報は以下の目的で利用します。</p>
                <ul className="list-disc ml-6 mb-4">
                    <li>練習参加の管理</li>
                    <li>申し込み内容の確認・編集</li>
                    <li>参加人数の把握</li>
                </ul>
            </Section>

            <Section title="3. 情報の第三者提供">
                <p className="mb-4 leading-relaxed">
                    法令に基づく場合を除き、本人の同意なく第三者に提供することはありません。
                </p>
            </Section>

            <Section title="4. 情報の管理">
                <p className="mb-4 leading-relaxed">
                    収集した情報は適切に管理し、不正アクセス・紛失・改ざん等を防止するための措置を講じます。
                </p>
            </Section>

            <Section title="5. お問い合わせ">
                <p className="mb-4 leading-relaxed">
                    個人情報の取り扱いに関するお問い合わせは、管理者までご連絡ください。
                </p>
            </Section>

            <p className="text-sm text-gray-500 mt-10">
                制定日：{new Date().getFullYear()}年
            </p>
        </PageContainer>
    );
}

function PageContainer({ children }: { children: React.ReactNode }) {
    return <div className="max-w-3xl mx-auto px-4 py-10">{children}</div>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="mt-8">
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            {children}
        </section>
    );
}
