import { defineType, defineField } from "sanity";

export const coachType = defineType({
  name: "coach",
  title: "Coaches",
  type: "document",

  preview: {
    select: {
      nameEn: "name.en",
      nameDe: "name.de",
      roleEn: "role.en",
      roleDe: "role.de",
      media: "image",
    },
    prepare({ nameEn, nameDe, roleEn, roleDe, media }) {
      return {
        title: nameEn || nameDe || "Untitled",
        subtitle: roleEn || roleDe || "",
        media: media,
      };
    },
  },

  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "object",
      fields: [
        {
          name: "en",
          title: "English",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "de",
          title: "German",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),

    defineField({
      name: "role",
      title: "Role",
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
      name: "bio",
      title: "Description",
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
    }),

    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
  ],
});
