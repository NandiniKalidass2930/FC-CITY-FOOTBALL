import { defineType, defineField } from "sanity";

export const heroType = defineType({
  name: "hero",
  title: "Hero Section",
  type: "document",
  
  preview: {
    select: {
      titleEn: "title.en",
      titleDe: "title.de",
    },
    prepare({ titleEn, titleDe }) {
      return {
        title: titleEn || titleDe || "Hero Section",
      };
    },
  },

  fields: [
    defineField({
      name: "heroMediaType",
      title: "Hero Background Media Type",
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
      name: "heroImage",
      title: "Hero Background Image",
      type: "image",
      options: { hotspot: true },
      hidden: ({ document }) => document?.heroMediaType !== "image",
    }),

    defineField({
      name: "heroVideo",
      title: "Hero Background Video",
      type: "object",
      hidden: ({ document }) => document?.heroMediaType !== "video",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const mediaType = (context?.document as any)?.heroMediaType
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
          options: {
            accept: "video/*",
          },
        }),
        defineField({
          name: "videoUrl",
          title: "Video URL (alternative)",
          type: "url",
          description: "If the video is hosted externally, paste the URL here instead of uploading.",
        }),
        defineField({
          name: "posterImage",
          title: "Fallback/Poster Image",
          type: "image",
          options: { hotspot: true },
          description: "Shown while the video loads and used as a fallback if the video fails.",
        }),
      ],
    }),

    defineField({
      name: "preClubMediaType",
      title: "Pre-Club Media Type (Above “More Than A Club”)",
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
      name: "preClubImage",
      title: "Pre-Club Image",
      type: "image",
      options: { hotspot: true },
      hidden: ({ document }) => document?.preClubMediaType !== "image",
    }),

    defineField({
      name: "preClubVideo",
      title: "Pre-Club Video",
      type: "object",
      hidden: ({ document }) => document?.preClubMediaType !== "video",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const mediaType = (context?.document as any)?.preClubMediaType
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
          options: {
            accept: "video/*",
          },
        }),
        defineField({
          name: "videoUrl",
          title: "Video URL (alternative)",
          type: "url",
          description: "If the video is hosted externally, paste the URL here instead of uploading.",
        }),
        defineField({
          name: "posterImage",
          title: "Fallback/Poster Image",
          type: "image",
          options: { hotspot: true },
          description: "Shown while the video loads and used as a fallback if the video fails.",
        }),
      ],
    }),

    defineField({
      name: "title",
      title: "Main Title",
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
      name: "titleZurich",
      title: "Title Zurich (Second Line)",
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
      name: "subtitle",
      title: "Subtitle",
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
      name: "primaryButtonText",
      title: "Primary Button Text",
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
      name: "primaryButtonLink",
      title: "Primary Button Link",
      type: "string",
      initialValue: "/contact",
    }),

    defineField({
      name: "secondaryButtonText",
      title: "Secondary Button Text",
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
      name: "secondaryButtonLink",
      title: "Secondary Button Link",
      type: "string",
      initialValue: "/our-team",
    }),

    // Home Page Additional Sections
    defineField({
      name: "aboutSection",
      title: "About Section (Home Page)",
      type: "object",
      fields: [
        {
          name: "image",
          title: "Image",
          type: "image",
          options: {
            hotspot: true,
          },
        },
        {
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
        },
        {
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
        },
        {
          name: "buttonText",
          title: "Button Text",
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
        },
        {
          name: "buttonLink",
          title: "Button Link",
          type: "string",
          initialValue: "/about",
        },
      ],
    }),

    defineField({
      name: "whyChooseUsSection",
      title: "Why Choose Us Section",
      type: "object",
      fields: [
        {
          name: "image",
          title: "Image",
          type: "image",
          options: {
            hotspot: true,
          },
        },
        {
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
        },
        {
          name: "intro",
          title: "Intro Text",
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
        },
        {
          name: "paragraph1",
          title: "Paragraph 1",
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
        },
        {
          name: "paragraph2",
          title: "Paragraph 2",
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
        },
      ],
    }),

    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "iconType",
              title: "Icon Type",
              type: "string",
              options: {
                list: [
                  { title: "Target", value: "Target" },
                  { title: "Users", value: "Users" },
                  { title: "GraduationCap", value: "GraduationCap" },
                  { title: "Sparkles", value: "Sparkles" },
                ],
              },
            },
            {
              name: "key",
              title: "Translation Key",
              type: "string",
              description: "e.g., 'trainingExcellence', 'teamSpirit'",
            },
            {
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
            },
            {
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
            },
            {
              name: "order",
              title: "Display Order",
              type: "number",
              initialValue: 0,
            },
          ],
        },
      ],
    }),

    defineField({
      name: "ctaSection",
      title: "CTA Section",
      type: "object",
      fields: [
        {
          name: "backgroundImage",
          title: "Background Image",
          type: "image",
          options: {
            hotspot: true,
          },
        },
        {
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
        },
        {
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
        },
        {
          name: "button1Text",
          title: "Button 1 Text",
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
        },
        {
          name: "button1Link",
          title: "Button 1 Link",
          type: "string",
          initialValue: "/contact",
        },
        {
          name: "button2Text",
          title: "Button 2 Text",
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
        },
        {
          name: "button2Link",
          title: "Button 2 Link",
          type: "string",
          initialValue: "/contact",
        },
      ],
    }),

    defineField({
      name: "goalsValues",
      title: "Goals & Values Section",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Section Title",
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
        },
        {
          name: "description",
          title: "Section Description",
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
        },
        {
          name: "cards",
          title: "Cards",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                {
                  name: "number",
                  title: "Number",
                  type: "string",
                },
                {
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
                },
                {
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
                },
                {
                  name: "image",
                  title: "Image",
                  type: "image",
                  options: {
                    hotspot: true,
                  },
                },
                {
                  name: "order",
                  title: "Display Order",
                  type: "number",
                  initialValue: 0,
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
});
