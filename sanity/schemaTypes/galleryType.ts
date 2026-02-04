import { defineType, defineField } from "sanity";

export const galleryType = defineType({
  name: "gallery",
  title: "Gallery",
  type: "document",
  
  preview: {
    select: {
      titleEn: "title.en",
      titleDe: "title.de",
      category: "category",
      media: "image",
      order: "order",
    },
    prepare({ titleEn, titleDe, category, media, order }) {
      const title = titleEn || titleDe || "Untitled Gallery Item";
      const subtitle = `${category || ""}${order !== undefined ? ` • Order: ${order}` : ""}`;
      return {
        title: title,
        subtitle: subtitle,
        media: media,
      };
    },
  },

  fields: [
    defineField({
      name: "title",
      title: "Title",
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
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Training", value: "training" },
          { title: "Match", value: "match" },
          { title: "Event", value: "event" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "caption",
      title: "Caption",
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
      name: "alt",
      title: "Alt Text",
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
      description: "Alternative text for accessibility",
    }),

    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first. Used for sorting.",
      initialValue: 0,
      validation: (Rule) => Rule.required().min(0),
    }),

    defineField({
      name: "isFeatured",
      title: "Featured",
      type: "boolean",
      description: "Mark as featured to highlight this image",
      initialValue: false,
    }),
  ],
});
