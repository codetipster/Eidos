"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { saveForm } from "./mutateForm";

export async function generateForm(
    prevState: {
        message: string;
    },
    FormData: FormData
) {
    const schema = z.object({
        description: z.string().min(1),
    });
    const parse = schema.safeParse({
        description: FormData.get("description"),
    });
    if (!parse.success) {
        console.log("Validation error:", parse.error);
        return {
            message: "Invalid form data, failed to parse data",
        };
    }

    if (!process.env.OPENAI_API_KEY) {
        console.log("No OpenAI API key found");
        return {
            message: "No OpenAI API key found",
        };
    }

    const data = parse.data;
    const promptExplanation = "Based on the description, generate a survey object with 3 fields: name(string) for the form, description(string) of the form and a questions array where every element has 2 fields: text and the fieldType and fieldType can be of these options RadioGroup, Select, Input, Textarea, Switch; and return it in json format. For RadioGroup, and Select types also return fieldOptions array with text and value fields. For example, for RadioGroup, and Select types, the field options array can be [{text: 'Yes', value: 'yes'}, {text: 'No', value: 'no'}] and for Input, Textarea, and Switch types, the field options array can be empty. for example, for Input, Textarea, and Switch types, the field options array can be []";
//fetching the form from the OpenAI API
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: `${data.description} ${promptExplanation}`,
                    },
                ],
            }),
        });
        const json = await response.json();
        console.log('Raw response from OpenAI:', json);
//checking if the response is in the expected format
        if (!json.choices || !json.choices[0] || !json.choices[0].message) {
            console.error("Unexpected response structure:", json);
            return {
                message: "Unexpected response structure from OpenAI",
                data: null,
            };
        }

        const generatedContent = JSON.parse(json.choices[0].message.content);
        console.log('Parsed generated content:', generatedContent);
        const responseObj = JSON.parse(json.choices[0].message.content);
//saving the form to the database using the saveForm function
        const dbFormId = await saveForm({
            name: responseObj.name,
            description: responseObj.description,
            questions: generatedContent.questions,
        });

        //console.log("Form saved with id", dbFormId);
//revalidating the path to update the form list
        revalidatePath("/");
        return {
            message: "Form generated successfully",
            //data: generatedContent,
            data: { formId: dbFormId },
        };
//catching any errors that may occur during the form generation
    } catch (error) {
        console.log("Error during form generation:", error);
        return {
            message: "Failed to generate form",
            data: null,
        };
    }
}
