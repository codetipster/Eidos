import Image from 'next/image'
import { Button } from '@/components/ui/button'
import FormGenerator from './form-generator'
import Header from '@/components/ui/header'
import { SessionProvider } from 'next-auth/react';
import { db } from '@/db';
import { forms } from '@/db/schema';
import FormsList from './forms/formsList';


export default async function Home() {
  const form = await db.query.forms.findMany()
  console.log(form)
  return (
      <SessionProvider>
      <Header />
      <main className="flex min-h-screen flex-col items-center p-24">
        <FormGenerator />
        <FormsList forms={form} />
      </main>
      </SessionProvider>
  )
}
