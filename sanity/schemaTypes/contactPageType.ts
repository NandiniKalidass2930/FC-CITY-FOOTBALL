import { defineType, defineField } from "sanity";

export const contactPageType = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  
  preview: {
    select: {
      titleEn: "title.en",
      titleDe: "title.de",
    },
    prepare({ titleEn, titleDe }) {
      return {
        title: titleEn || titleDe || "Contact Page",
      };
    },
  },

  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "object",
      fields: [
        {
          name: "en",
          title: "English",
          type: "string",
        },
        {
          name: "de",
          title: "German",
          type: "string",
        },
      ],
      description: "Main title for the contact page",
    }),

    defineField({
      name: "description",
      title: "Page Description",
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
      description: "Description text for the contact page",
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
    }),

    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
      description: "Contact phone number",
    }),

    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
      description: "Contact email address",
      validation: (Rule) => Rule.email(),
    }),

    defineField({
      name: "mapEmbedUrl",
      title: "Google Maps Embed URL",
      type: "url",
      description: "Full Google Maps embed iframe URL (e.g., https://www.google.com/maps?q=...&output=embed)",
    }),

    defineField({
      name: "openingHours",
      title: "Opening Hours",
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
      description: "Opening hours information (optional)",
    }),

    defineField({
      name: "socialLinks",
      title: "Social Media Links",
      type: "array",
      description: "Add social media links for the Follow Us section",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "Facebook", value: "Facebook" },
                  { title: "Instagram", value: "Instagram" },
                  { title: "Twitter", value: "Twitter" },
                  { title: "YouTube", value: "YouTube" },
                ],
                layout: "radio",
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: "url",
              title: "URL",
              type: "url",
              description: "Full URL to the social media profile",
              validation: (Rule) => Rule.required().uri({
                scheme: ["http", "https"],
              }),
            },
            {
              name: "icon",
              title: "Custom Icon (Optional)",
              type: "string",
              description: "Optional: Custom icon identifier (not used if platform is set)",
            },
          ],
          preview: {
            select: {
              platform: "platform",
              url: "url",
            },
            prepare({ platform, url }) {
              return {
                title: platform || "Social Link",
                subtitle: url || "No URL",
              };
            },
          },
        },
      ],
    }),
  ],
});
