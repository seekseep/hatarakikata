'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { FormProvider,useForm } from 'react-hook-form'

import Alert from '@/ui/components/basic/Alert'
import Breadcrumb from '@/ui/components/basic/Breadcrumb'
import Button from '@/ui/components/basic/Button'
import TextField from '@/ui/components/basic/field/TextField'
import { useUpdatePasswordMutation } from '@/ui/hooks/auth'
import { type UpdatePasswordParameters,UpdatePasswordParametersSchema } from '@/ui/service/auth'

export default function MePasswordPage() {
  const router = useRouter()
  const mutation = useUpdatePasswordMutation()
  const methods = useForm<UpdatePasswordParameters>({
    resolver: zodResolver(UpdatePasswordParametersSchema),
  })

  const onSubmit = (data: UpdatePasswordParameters) => {
    mutation.mutate(data, {
      onSuccess: () => router.push('/me'),
    })
  }

  return (
    <>
        <Breadcrumb items={[
          { label: 'ホーム', href: '/' },
          { label: 'マイページ', href: '/me' },
          { label: 'パスワード変更' },
        ]} />

        <div className="text-2xl py-4">
          パスワード変更
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm space-y-6">
          {mutation.isError && (
            <Alert variant="error">
              パスワードの変更に失敗しました。入力内容を確認してください。
            </Alert>
          )}

          <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <TextField<UpdatePasswordParameters>
              name="password"
              label="新しいパスワード"
              type="password"
              autoComplete="new-password"
              placeholder="パスワードを入力"
            />
            <TextField<UpdatePasswordParameters>
              name="confirmPassword"
              label="パスワード確認"
              type="password"
              autoComplete="new-password"
              placeholder="パスワードを再入力"
            />
            <Button
              type="submit"
              disabled={mutation.isPending}>
              {mutation.isPending ? '変更中...' : '変更する'}
            </Button>
          </form>
          </FormProvider>
        </div>
    </>
  )
}
