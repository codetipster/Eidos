import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  serial,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core"
import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import type { AdapterAccountType } from "next-auth/adapters"
import { relations } from "drizzle-orm"

export const formElements = pgEnum("fieldType", [
  "Select",
  "textarea",
  "RadioGroup",
  "Input",
  "Switch",
])
 
//const connectionString = "postgres://postgres:postgres@localhost:5432/drizzle"
const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/drizzle";
const pool = postgres(connectionString, { max: 1 })
 
export const db = drizzle(pool)
 
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
})
 
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verficationToken) => ({
    compositePk: primaryKey({
      columns: [verficationToken.identifier, verficationToken.token],
    }),
  })
)

 
export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})
 
export const forms = pgTable("forms", {
  id: serial("id").primaryKey(),
  name: text("name"),
  description: text("description"),
  userId: text("user_id"),
  published: boolean("published"),
})

export const formsRelations =  relations(forms, ({ many, one}) => ({
  questions: many(questions), //one form can have many questions
  user: one(users, {
    fields: [forms.userId],
    references: [users.id],
  })
}))

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  text: text("text"),
  fieldType: formElements("field_type"),
  formId: integer("form_id"),
})

export const questionsRelations = relations(questions, ({ one, many }) => ({
  form: one(forms, {
    fields: [questions.formId],
    references: [forms.id],
  }),
  fieldOptions: many(fieldOptions),
}))

export const fieldOptions = pgTable("fieldOptions", {
  id: serial("id").primaryKey(),
  text: text("text"),
  questionId: integer("question_id"),
  value: text("value"),
})

export const fieldOptionsRelations = relations(fieldOptions, ({ one }) => ({
  question: one(questions, {
    fields: [fieldOptions.questionId],
    references: [questions.id],
  }),
}))
