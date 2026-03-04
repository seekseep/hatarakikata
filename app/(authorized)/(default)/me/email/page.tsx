'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { FormProvider,useForm } from 'react-hook-form'

import Alert from '@/ui/components/basic/Alert'
import Breadcrumb from '@/ui/components/basic/Breadcrumb'
import Button from '@/ui/components/basic/Button'
import TextField from '@/ui/components/basic/field/TextField'
import { useUpdateEmailMutation } from '@/ui/hooks/auth'
import { type UpdateEmailParameters,UpdateEmailParametersSchema } from '@/ui/service/auth'

export default function MeEmailPage() {
  const mutation = useUpdateEmailMutation()
  const methods = useForm<UpdateEmailParameters>({
    resolver: zodResolver(UpdateEmailParametersSchema),
  })

  const onSubmit = (data: UpdateEmailParameters) => {
    mutation.mutate(data)
  }

  return (
    <>
        <Breadcrumb items={[
          { label: 'ホーム', href: '/' },
          { label: 'マイページ', href: '/me' },
          { label: 'メールアドレス変更' },
        ]} />

        <div className="text-2xl py-4">
          メールアドレス変更
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm space-y-6">
          {mutation.isError && (
            <Alert variant="error">
              メールアドレスの変更に失敗しました。入力内容を確認してください。
            </Alert>
          )}

          {mutation.isSuccess ? (
            <div className="space-y-4">
              <Alert variant="success">
                確認メールを送信しました。新しいメールアドレスに届いたリンクをクリックして変更を完了してください。
              </Alert>
              <Link href="/me" className="block text-center text-sm text-primary-600 hover:underline">
                マイページに戻る
              </Link>
            </div>
          ) : (
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
                <TextField<UpdateEmailParameters>
                  name="email"
                  label="新しいメールアドレス"
                  type="email"
                  autoComplete="email"
                  placeholder="メールアドレスを入力"
                />
                <Button
                  type="submit"
                  disabled={mutation.isPending}>
                  {mutation.isPending ? '変更中...' : '変更する'}
                </Button>
              </form>
            </FormProvider>
          )}
        </div>
    </>
  )
}
