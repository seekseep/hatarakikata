'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { FormProvider,useForm } from 'react-hook-form'
import { z } from 'zod'

import Alert from '@/ui/components/basic/Alert'
import Breadcrumb from '@/ui/components/basic/Breadcrumb'
import Button from '@/ui/components/basic/Button'
import TextField from '@/ui/components/basic/field/TextField'
import { CURRENT_USER_QUERY_KEY,useCurrentUserQuery, useUpdateCurrentUserMutation } from '@/ui/hooks/user'

const UpdateNameFormSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
})

type UpdateNameForm = z.infer<typeof UpdateNameFormSchema>

export default function MeNamePage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: currentUser } = useCurrentUserQuery()
  const mutation = useUpdateCurrentUserMutation()
  const methods = useForm<UpdateNameForm>({
    resolver: zodResolver(UpdateNameFormSchema),
    defaultValues: {
      name: currentUser?.name ?? '',
    },
  })

  const onSubmit = (data: UpdateNameForm) => {
    mutation.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY })
        router.push('/me')
      },
    })
  }

  return (
    <>
        <Breadcrumb items={[
          { label: 'ホーム', href: '/' },
          { label: 'マイページ', href: '/me' },
          { label: '名前' },
        ]} />

        <div className="text-2xl py-4">
          名前
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm space-y-6">
          {mutation.isError && (
            <Alert variant="error">
              名前の変更に失敗しました。入力内容を確認してください。
            </Alert>
          )}

          <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <TextField<UpdateNameForm>
              name="name"
              label="新しい名前"
              type="text"
              autoComplete="name"
              placeholder="名前を入力"
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
