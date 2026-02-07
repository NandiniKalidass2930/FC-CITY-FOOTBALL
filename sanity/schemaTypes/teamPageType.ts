import { defineType, defineField } from "sanity";

export const teamPageType = defineType({
  name: "teamPage",
  title: "Team Page",
  type: "document",
  
  preview: {
    select: {
      titleEn: "heroTitle.en",
      titleDe: "heroTitle.de",
    },
    prepare({ titleEn, titleDe }) {
      return {
        title: titleEn || titleDe || "Team Page",
      };
    },
  },

  fields: [
    // Hero Section
    defineField({
      name: "heroBackgroundImage",
      title: "Hero Background Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: "heroTitle",
      title: "Hero Title",
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
      name: "heroSubtitle",
      title: "Hero Subtitle",
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

    // Player Highlights Section
    defineField({
      name: "playerHighlights",
      title: "Player Highlights",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "player",
              title: "Player",
              type: "reference",
              to: [{ type: "player" }],
            },
            {
              name: "image",
              title: "Highlight Image (Override)",
              type: "image",
              description: "Optional: Override player image with custom highlight image",
              options: {
                hotspot: true,
              },
            },
            {
              name: "badge",
              title: "Badge Text",
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
              name: "title",
              title: "Title (Override)",
              type: "object",
              description: "Optional: Override player name",
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
              title: "Description (Override)",
              type: "object",
              description: "Optional: Override player description",
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
              playerNameEn: "player.name.en",
              playerNameDe: "player.name.de",
              titleEn: "title.en",
              titleDe: "title.de",
              badgeEn: "badge.en",
              badgeDe: "badge.de",
              media: "image",
            },
            prepare({ playerNameEn, playerNameDe, titleEn, titleDe, badgeEn, badgeDe, media }) {
              const name = titleEn || titleDe || playerNameEn || playerNameDe || "Untitled Highlight"
              const badge = badgeEn || badgeDe || ""
              return {
                title: name,
                subtitle: badge,
                media: media,
              };
            },
          },
        },
      ],
    }),

    // Training Schedule Section
    defineField({
      name: "trainingSchedule",
      title: "Training Schedule",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "day",
              title: "Day",
              type: "string",
              options: {
                list: [
                  { title: "Monday", value: "monday" },
                  { title: "Tuesday", value: "tuesday" },
                  { title: "Wednesday", value: "wednesday" },
                  { title: "Thursday", value: "thursday" },
                  { title: "Friday", value: "friday" },
                  { title: "Saturday", value: "saturday" },
                  { title: "Sunday", value: "sunday" },
                ],
              },
            },
            {
              name: "time",
              title: "Time",
              type: "string",
              description: "e.g., '18:00 - 20:00' or 'Rest Day'",
            },
            {
              name: "location",
              title: "Location",
              type: "string",
              options: {
                list: [
                  { title: "Field", value: "field" },
                  { title: "Gym", value: "gym" },
                  { title: "Rest Day", value: "-" },
                ],
              },
            },
            {
              name: "category",
              title: "Category / Type",
              type: "string",
              options: {
                list: [
                  { title: "Tactical", value: "tactical" },
                  { title: "Technical", value: "technical" },
                  { title: "Physical", value: "physical" },
                  { title: "Rest Day", value: "-" },
                ],
              },
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
              day: "day",
              time: "time",
              location: "location",
              category: "category",
            },
            prepare({ day, time, location, category }) {
              return {
                title: `${day ? day.charAt(0).toUpperCase() + day.slice(1) : "Day"}: ${time || ""}`,
                subtitle: `${location !== "-" ? location : ""} ${category !== "-" ? `• ${category}` : ""}`,
              };
            },
          },
        },
      ],
    }),

    // Achievements Section
    defineField({
      name: "achievements",
      title: "Achievements",
      type: "array",
      of: [
        {
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
              name: "value",
              title: "Count / Number",
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
              name: "iconType",
              title: "Icon Type",
              type: "string",
              options: {
                list: [
                  { title: "Trophy", value: "Trophy" },
                  { title: "Award", value: "Award" },
                  { title: "Calendar", value: "Calendar" },
                  { title: "Star", value: "Star" },
                ],
              },
              initialValue: "Trophy",
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
              titleEn: "title.en",
              titleDe: "title.de",
              value: "value",
              suffix: "suffix",
              iconType: "iconType",
            },
            prepare({ titleEn, titleDe, value, suffix, iconType }) {
              const title = titleEn || titleDe || "Achievement"
              return {
                title: `${value || 0}${suffix || ""} ${title}`,
                subtitle: `Icon: ${iconType || "Trophy"}`,
              };
            },
          },
        },
      ],
    }),
  ],
});
