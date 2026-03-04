import Link from 'next/link'

import Alert from '@/ui/components/basic/Alert'
import Breadcrumb from '@/ui/components/basic/Breadcrumb'

export default function EmailConfirmedPage() {
  return (
    <>
        <Breadcrumb items={[
          { label: 'ホーム', href: '/' },
          { label: 'マイページ', href: '/me' },
          { label: 'メールアドレス変更完了' },
        ]} />

        <div className="text-2xl py-4">
          メールアドレス変更完了
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm space-y-4">
          <Alert variant="success">
            メールアドレスの変更が完了しました。
          </Alert>
          <Link href="/me" className="block text-center text-sm text-primary-600 hover:underline">
            マイページに戻る
          </Link>
        </div>
    </>
  )
}
