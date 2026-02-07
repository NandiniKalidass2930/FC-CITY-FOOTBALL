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
      media: "galleryImage",
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
      name: "mediaType",
      title: "Media Type",
      type: "string",
      initialValue: "image",
      validation: (Rule) => Rule.required(),
      options: {
        layout: "radio",
        list: [
          { title: "Image", value: "image" },
          { title: "Video", value: "video" },
        ],
      },
    }),

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
    }),

    defineField({
      name: "galleryImage",
      title: "Gallery Image",
      type: "image",
      options: {
        hotspot: true,
      },
      hidden: ({ document }) => document?.mediaType !== "image",
    }),

    defineField({
      name: "galleryVideo",
      title: "Gallery Video",
      type: "object",
      hidden: ({ document }) => document?.mediaType !== "video",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const mediaType = (context?.document as any)?.mediaType
          if (mediaType !== "video") return true

          const hasFile = Boolean((value as any)?.videoFile?.asset)
          const hasUrl = Boolean((value as any)?.videoUrl)

          if (!hasFile && !hasUrl) {
            return "Provide either a video upload or a video URL."
          }
          return true
        }),
      fields: [
        defineField({
          name: "videoFile",
          title: "Video Upload",
          type: "file",
          options: { accept: "video/*" },
        }),
        defineField({
          name: "videoUrl",
          title: "Video URL (alternative)",
          type: "url",
          description: "If the video is hosted externally, paste the URL here instead of uploading.",
        }),
        defineField({
          name: "posterImage",
          title: "Thumbnail / Poster Image",
          type: "image",
          options: { hotspot: true },
          description: "Used for previews and as a fallback if the video can’t load.",
        }),
      ],
    }),

    // Legacy field kept for backwards compatibility with existing content.
    defineField({
      name: "image",
      title: "Image (Legacy)",
      type: "image",
      options: { hotspot: true },
      hidden: ({ document }) => (document as any)?.galleryImage || (document as any)?.galleryVideo,
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
          { title: "Video", value: "video" },
        ],
        layout: "dropdown",
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

    defineField({
      name: "mediaRequired",
      title: "Media Required (Validation Helper)",
      type: "string",
      readOnly: true,
      hidden: true,
      validation: (Rule) =>
        Rule.custom((_, context) => {
          const doc = context?.document as any
          const mediaType = doc?.mediaType
          const hasImage = Boolean(doc?.galleryImage?.asset) || Boolean(doc?.image?.asset)
          const hasVideo = Boolean(doc?.galleryVideo?.videoFile?.asset) || Boolean(doc?.galleryVideo?.videoUrl)

          if (mediaType === "image" && !hasImage) return "galleryImage is required when Media Type is Image"
          if (mediaType === "video" && !hasVideo) return "galleryVideo is required when Media Type is Video"
          return true
        }),
    }),
  ],
});
