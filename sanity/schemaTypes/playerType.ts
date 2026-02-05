import { defineType, defineField } from "sanity";

export const playerType = defineType({
  name: "player",
  title: "Players",
  type: "document",

  preview: {
    select: {
      nameEn: "name.en",
      nameDe: "name.de",
      positionEn: "position.en",
      positionDe: "position.de",
      number: "number",
      media: "image",
    },
    prepare({ nameEn, nameDe, positionEn, positionDe, number, media }) {
      const name = nameEn || nameDe || "Untitled";
      const position = positionEn || positionDe || "";
      const subtitle = number ? `#${number}${position ? ` • ${position}` : ""}` : position;
      
      return {
        title: name,
        subtitle: subtitle,
        media: media,
      };
    },
  },

  fields: [
    defineField({
      name: "name",
      title: "Player Name",
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
      name: "number",
      title: "Jersey Number",
      type: "number",
    }),

    defineField({
      name: "position",
      title: "Position",
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
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          "Under 21",
          "Under 17",
          "Under 15",
          "Under 13",
          "Under 11",
          "Over 30",
          "Over 50",
          "FC City Girls",
        ],
      },
    }),

    defineField({
      name: "highlight",
      title: "Highlight",
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
      name: "description",
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
      title: "Player Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
  ],
});
