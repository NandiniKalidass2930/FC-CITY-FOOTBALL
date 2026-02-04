import { defineType, defineField } from "sanity";

export const aboutType = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  
  preview: {
    select: {
      titleEn: "title.en",
      titleDe: "title.de",
    },
    prepare({ titleEn, titleDe }) {
      return {
        title: titleEn || titleDe || "About Page",
      };
    },
  },

  fields: [
    // Hero Section
    defineField({
      name: "title",
      title: "Page Title",
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
      name: "heroBadge",
      title: "Hero Badge Text",
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
      name: "heroButtonText",
      title: "Hero Button Text",
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
      name: "heroButtonLink",
      title: "Hero Button Link",
      type: "string",
      initialValue: "/contact",
    }),

    // Section Images
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: "sectionImages",
      title: "Section Images",
      type: "array",
      of: [
        {
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

    // Section Videos (Optional)
    defineField({
      name: "sectionVideos",
      title: "Section Videos (Optional)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "videoFile",
              title: "Video File",
              type: "file",
              options: {
                accept: "video/*",
              },
            },
            {
              name: "videoUrl",
              title: "Video URL (Alternative)",
              type: "url",
              description: "If video is hosted externally, use this instead of uploading",
            },
            {
              name: "posterImage",
              title: "Poster Image",
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
    }),

    // Mission & Vision
    defineField({
      name: "missionTitle",
      title: "Mission Title",
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
      name: "missionContent",
      title: "Mission Content",
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
      name: "visionTitle",
      title: "Vision Title",
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
      name: "visionContent",
      title: "Vision Content",
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
      name: "visionMissionTitle",
      title: "Vision & Mission Section Title",
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

    // CTA Section
    defineField({
      name: "ctaTitle",
      title: "CTA Title",
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
      name: "ctaDescription",
      title: "CTA Description",
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
      name: "ctaButton1Text",
      title: "CTA Button 1 Text",
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
      name: "ctaButton1Link",
      title: "CTA Button 1 Link",
      type: "string",
      initialValue: "/contact",
    }),

    defineField({
      name: "ctaButton2Text",
      title: "CTA Button 2 Text",
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
      name: "ctaButton2Link",
      title: "CTA Button 2 Link",
      type: "string",
      initialValue: "/training",
    }),

    // Stats Section
    defineField({
      name: "historySection",
      title: "History Section",
      type: "object",
      fields: [
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
          name: "content",
          title: "Content",
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
      name: "contentCards",
      title: "Content Cards (Why Join, Training Philosophy, Community Impact)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "type",
              title: "Card Type",
              type: "string",
              options: {
                list: [
                  { title: "Why Join Us", value: "whyJoin" },
                  { title: "Training Philosophy", value: "trainingPhilosophy" },
                  { title: "Community Impact", value: "communityImpact" },
                ],
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
              name: "content",
              title: "Content",
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
          preview: {
            select: {
              type: "type",
              titleEn: "title.en",
              titleDe: "title.de",
            },
            prepare({ type, titleEn, titleDe }) {
              return {
                title: titleEn || titleDe || "Content Card",
                subtitle: type || "",
              };
            },
          },
        },
      ],
    }),

    defineField({
      name: "stats",
      title: "Stats",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "value",
              title: "Value",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            },
            {
              name: "suffix",
              title: "Suffix",
              type: "string",
              description: "e.g., '+', '', 'years'",
              initialValue: "",
            },
            {
              name: "label",
              title: "Label",
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
              name: "iconType",
              title: "Icon Type",
              type: "string",
              options: {
                list: [
                  { title: "Users", value: "Users" },
                  { title: "Trophy", value: "Trophy" },
                  { title: "Heart", value: "Heart" },
                  { title: "Calendar Days", value: "CalendarDays" },
                ],
              },
              initialValue: "Users",
            },
            {
              name: "order",
              title: "Display Order",
              type: "number",
              initialValue: 0,
            },
          ],
          preview: {
            select: {
              value: "value",
              suffix: "suffix",
              labelEn: "label.en",
              labelDe: "label.de",
              iconType: "iconType",
            },
            prepare({ value, suffix, labelEn, labelDe, iconType }) {
              const label = labelEn || labelDe || "Stat"
              return {
                title: `${value}${suffix || ""} ${label}`,
                subtitle: `Icon: ${iconType || "Users"}`,
              }
            },
          },
        },
      ],
    }),
  ],
});
