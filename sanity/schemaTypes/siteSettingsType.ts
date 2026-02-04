import { defineType, defineField } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  
  // Singleton pattern - only one document allowed
  __experimental_actions: [
    // "create",
    "update",
    // "delete",
    "publish",
  ],
  
  preview: {
    select: {
      email: "email",
    },
    prepare({ email }) {
      return {
        title: "Site Settings",
        subtitle: email || "No email set",
      };
    },
  },

  fields: [
    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
      description: "Primary contact email (used in Footer and Contact page)",
      validation: (Rule) => Rule.required().email(),
    }),

    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
      description: "Contact phone number",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "address",
      title: "Address",
      type: "object",
      fields: [
        {
          name: "en",
          title: "English",
          type: "text",
        },
        {
          name: "de",
          title: "German",
          type: "text",
        },
      ],
      description: "Full address in both languages",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "mapEmbedUrl",
      title: "Google Maps Embed URL",
      type: "url",
      description: "Full Google Maps embed iframe URL (e.g., https://www.google.com/maps?q=...&output=embed)",
    }),
  ],
});
