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

    defineField({
      name: "backgroundVideo",
      title: "Background Video",
      type: "file",
      options: {
        accept: "video/*",
      },
    }),

    defineField({
      name: "backgroundVideoUrl",
      title: "Background Video URL (Alternative)",
      type: "url",
      description: "If video is hosted externally, use this instead of uploading",
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
