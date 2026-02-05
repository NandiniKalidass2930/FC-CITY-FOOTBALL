import { defineType, defineField } from "sanity"

export const teamGroupPhotoType = defineType({
  name: "teamGroupPhoto",
  title: "Team Group Photos",
  type: "document",

  preview: {
    select: {
      title: "title",
      category: "category",
      media: "image",
    },
    prepare({ title, category, media }) {
      return {
        title: title || category || "Team Group Photo",
        subtitle: category || "",
        media,
      }
    },
  },

  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "badgeName",
      title: "Badge Name",
      type: "string",
      description: "Short label shown on top of the group photo (uppercase-friendly), e.g. 'UNDER 21'.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "category",
      title: "Category",
      type: "string",
      validation: (Rule) => Rule.required(),
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
      name: "image",
      title: "Group Photo",
      type: "image",
      validation: (Rule) => Rule.required(),
      options: {
        hotspot: true,
      },
    }),
  ],
})

