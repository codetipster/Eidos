import React from 'react'
import { db } from '@/db'
import { forms } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'
import Form from '../../Form'


const page = async ({params}: {
    params: {
        formId: string
    }
    
}) => {
    const {formId} = params

    const session = await auth()
    const userId = session?.user?.id
   
    const form = await db.query.forms.findFirst({
        where: eq(forms.id, parseInt(formId)),
        with: {
            questions: {
                with: {
                    fieldOptions: true
                }
            }
        }
    })

    if (!formId) {
        return <div>Form not found</div>
    }

    if(userId !== form?.userId) {
        return <div>Not authorized to view this form</div>
    }

    if (!form) {
        return <div>Loading form...</div>;
    }

  return (
        < Form form={form} editMode={true}/>
  )
}

export default page