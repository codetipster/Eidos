"use client";
import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
  } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea';
import { generateForm } from '@/actions/generateForm';
import { useFormState, useFormStatus } from 'react-dom';
import  { useSession, signIn } from 'next-auth/react'
import { navigate } from '@/actions/navigateToForm';

type Props = {}

const initialState : {
    message: string,
    data?: any
} = {
    message: '',
    data: null,
}

export function SubmitButton() {
    const {pending} = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Generating...' : 'Generate'}
        </Button>
    )
}
  
const FormGenerator = (props: Props) => {
    const [state, formAction] = useFormState(generateForm, initialState);
    const session = useSession();
    //console.log('session',session)
    const [open, setOpen] = useState(false)

    const onFormCreate = () => {
        if (session.data?.user ) {
            setOpen(true)
        }
        else {
            signIn()
        }
    }

    useEffect(() => {
        console.log("Current state", state)
        if (state.message === "Form generated successfully") {
            setOpen(false)
            navigate(state.data.formId)
        }
        console.log("State message:", state.message);
        console.log("State data:", state.data);
    }, [state])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <Button onClick={onFormCreate}>Create Form</Button>
        <DialogContent className='sm:max-w-[526px]'>
            <DialogHeader>
                <DialogTitle>Create New Form</DialogTitle>
            </DialogHeader>
            <form action={formAction}>
                <div className='grid gap-4 py-4'>
                    <Textarea id='description' name='description' required placeholder='Tell Eidos what your form is about, its purpose, who your target audience are and what informations you would like to collect and let Eidos AI do the magic' />
                </div>
            <DialogFooter> 
                <SubmitButton />
                <Button variant="link">Create Manually</Button>
            </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default FormGenerator