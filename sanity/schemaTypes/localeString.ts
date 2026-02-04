import { defineField, defineType } from "sanity";

/**
 * Locale String - A field type that stores translations for en and de
 */
export const localeString = defineType({
  name: "localeString",
  title: "Localized String",
  type: "object",
  fields: [
    defineField({
      name: "en",
      title: "English",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "de",
      title: "German",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
});

/**
 * Locale Text - A field type that stores longer translations for en and de
 */
export const localeText = defineType({
  name: "localeText",
  title: "Localized Text",
  type: "object",
  fields: [
    defineField({
      name: "en",
      title: "English",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "de",
      title: "German",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
