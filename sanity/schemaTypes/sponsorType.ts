import { defineType, defineField } from "sanity";

export const sponsorType = defineType({
  name: "sponsor",
  title: "Sponsors",
  type: "document",
  
  preview: {
    select: {
      nameEn: "name.en",
      nameDe: "name.de",
      media: "logo",
    },
    prepare({ nameEn, nameDe, media }) {
      return {
        title: nameEn || nameDe || "Untitled Sponsor",
        media: media,
      };
    },
  },

  fields: [
    defineField({
      name: "name",
      title: "Sponsor Name",
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
    }),

    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "websiteUrl",
      title: "Website URL",
      type: "url",
      description: "Link to sponsor's website",
    }),

    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first",
      initialValue: 0,
    }),
  ],
});
