import { defineType, defineField } from "sanity";

export const trainerType = defineType({
  name: "trainer",
  title: "Trainer",
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
        title: nameEn || nameDe || "Trainer",
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
        { name: "en", title: "English", type: "string" },
        { name: "de", title: "German", type: "string" },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "object",
      fields: [
        { name: "en", title: "English", type: "string" },
        { name: "de", title: "German", type: "string" },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "object",
      fields: [
        { name: "en", title: "English", type: "text" },
        { name: "de", title: "German", type: "text" },
      ],
      description: "Brief description about the trainer",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 0,
      description: "Lower numbers appear first",
    }),
  ],
});
