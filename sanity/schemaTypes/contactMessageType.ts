import { defineType, defineField } from "sanity";

export const contactMessageType = defineType({
  name: "contactMessage",
  title: "Contact Message",
  type: "document",
  
  preview: {
    select: {
      name: "name",
      email: "email",
      subject: "subject",
      createdAt: "createdAt",
    },
    prepare({ name, email, subject, createdAt }) {
      const date = createdAt 
        ? new Date(createdAt).toLocaleDateString()
        : "No date";
      return {
        title: subject || "No Subject",
        subtitle: `${name || "Anonymous"} (${email || "No email"}) - ${date}`,
      };
    },
  },

  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(100),
    }),

    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),

    defineField({
      name: "subject",
      title: "Subject",
      type: "string",
      validation: (Rule) => Rule.required().min(3).max(200),
    }),

    defineField({
      name: "message",
      title: "Message",
      type: "text",
      validation: (Rule) => Rule.required().min(10).max(5000),
      rows: 5,
    }),

    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
  ],

  orderings: [
    {
      title: "Date (Newest First)",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
    {
      title: "Date (Oldest First)",
      name: "createdAtAsc",
      by: [{ field: "createdAt", direction: "asc" }],
    },
    {
      title: "Name (A-Z)",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
});
