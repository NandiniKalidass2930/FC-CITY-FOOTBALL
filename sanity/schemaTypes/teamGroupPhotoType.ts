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
      name: "groupPhotos",
      title: "Group Photos",
      type: "array",
      description: "Upload multiple group photos for this category. If multiple are provided, the site will auto-slide them.",
      of: [
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const doc = context?.document as any
          const legacyImage = doc?.image
          const hasLegacyImage = Boolean(legacyImage?.asset)
          const hasGroupPhotos = Array.isArray(value) && value.length > 0
          if (!hasGroupPhotos && !hasLegacyImage) {
            return "Add at least one image (either Group Photos or the legacy Group Photo field)."
          }
          return true
        }),
    }),

    defineField({
      name: "image",
      title: "Group Photo (Legacy)",
      type: "image",
      hidden: ({ document }) => Array.isArray((document as any)?.groupPhotos) && ((document as any)?.groupPhotos?.length || 0) > 0,
      options: {
        hotspot: true,
      },
    }),
  ],
})

