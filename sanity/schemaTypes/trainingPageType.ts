import { defineType, defineField } from "sanity";

export const trainingPageType = defineType({
  name: "trainingPage",
  title: "Training Page",
  type: "document",
  
  preview: {
    select: {
      titleEn: "heroTitle.en",
      titleDe: "heroTitle.de",
    },
    prepare({ titleEn, titleDe }) {
      return {
        title: titleEn || titleDe || "Training Page",
      };
    },
  },

  fields: [
    // Hero Section
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "object",
      fields: [
        { name: "en", title: "English", type: "string" },
        { name: "de", title: "German", type: "string" },
      ],
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "object",
      fields: [
        { name: "en", title: "English", type: "string" },
        { name: "de", title: "German", type: "string" },
      ],
    }),
    defineField({
      name: "heroDescription",
      title: "Hero Description",
      type: "object",
      fields: [
        { name: "en", title: "English", type: "text" },
        { name: "de", title: "German", type: "text" },
      ],
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "heroButton1Text",
      title: "Hero Button 1 Text",
      type: "object",
      fields: [
        { name: "en", title: "English", type: "string" },
        { name: "de", title: "German", type: "string" },
      ],
    }),
    defineField({
      name: "heroButton1Link",
      title: "Hero Button 1 Link",
      type: "string",
      initialValue: "/contact",
    }),
    defineField({
      name: "heroButton2Text",
      title: "Hero Button 2 Text",
      type: "object",
      fields: [
        { name: "en", title: "English", type: "string" },
        { name: "de", title: "German", type: "string" },
      ],
    }),
    defineField({
      name: "heroButton2Link",
      title: "Hero Button 2 Link",
      type: "string",
      initialValue: "/our-team",
    }),

    // Training Highlights
    defineField({
      name: "highlights",
      title: "Training Highlights",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
            },
            {
              name: "caption",
              title: "Caption",
              type: "object",
              fields: [
                { name: "en", title: "English", type: "string" },
                { name: "de", title: "German", type: "string" },
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
              captionEn: "caption.en",
              captionDe: "caption.de",
              media: "image",
            },
            prepare({ captionEn, captionDe, media }) {
              return {
                title: captionEn || captionDe || "Training Highlight",
                media: media,
              };
            },
          },
        },
      ],
    }),

    // Overview Section
    defineField({
      name: "overview",
      title: "Training Overview",
      type: "object",
      fields: [
        {
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
        },
        {
          name: "title",
          title: "Title",
          type: "object",
          fields: [
            { name: "en", title: "English", type: "string" },
            { name: "de", title: "German", type: "string" },
          ],
        },
        {
          name: "description",
          title: "Description",
          type: "object",
          fields: [
            { name: "en", title: "English", type: "text" },
            { name: "de", title: "German", type: "text" },
          ],
        },
        {
          name: "buttonText",
          title: "Button Text",
          type: "object",
          fields: [
            { name: "en", title: "English", type: "string" },
            { name: "de", title: "German", type: "string" },
          ],
        },
        {
          name: "buttonLink",
          title: "Button Link",
          type: "string",
          initialValue: "/contact",
        },
      ],
    }),

    // Indoor Training Sessions
    defineField({
      name: "indoorSessions",
      title: "Indoor Training Sessions",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "day",
              title: "Day",
              type: "object",
              fields: [
                { name: "en", title: "English", type: "string" },
                { name: "de", title: "German", type: "string" },
              ],
            },
            {
              name: "time",
              title: "Time",
              type: "string",
            },
            {
              name: "location",
              title: "Location",
              type: "object",
              fields: [
                { name: "en", title: "English", type: "string" },
                { name: "de", title: "German", type: "string" },
              ],
            },
            {
              name: "address",
              title: "Address",
              type: "object",
              fields: [
                { name: "en", title: "English", type: "string" },
                { name: "de", title: "German", type: "string" },
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
              dayEn: "day.en",
              dayDe: "day.de",
              time: "time",
            },
            prepare({ dayEn, dayDe, time }) {
              return {
                title: `${dayEn || dayDe || "Day"} - ${time || ""}`,
              };
            },
          },
        },
      ],
    }),

    // Outdoor Training Sessions
    defineField({
      name: "outdoorSessions",
      title: "Outdoor Training Sessions",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "day",
              title: "Day",
              type: "object",
              fields: [
                { name: "en", title: "English", type: "string" },
                { name: "de", title: "German", type: "string" },
              ],
            },
            {
              name: "time",
              title: "Time",
              type: "string",
            },
            {
              name: "location",
              title: "Location",
              type: "object",
              fields: [
                { name: "en", title: "English", type: "string" },
                { name: "de", title: "German", type: "string" },
              ],
            },
            {
              name: "address",
              title: "Address",
              type: "object",
              fields: [
                { name: "en", title: "English", type: "string" },
                { name: "de", title: "German", type: "string" },
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
              dayEn: "day.en",
              dayDe: "day.de",
              time: "time",
            },
            prepare({ dayEn, dayDe, time }) {
              return {
                title: `${dayEn || dayDe || "Day"} - ${time || ""}`,
              };
            },
          },
        },
      ],
    }),

    // Facilities
    defineField({
      name: "facilities",
      title: "Our Facilities",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
            },
            {
              name: "title",
              title: "Title",
              type: "object",
              fields: [
                { name: "en", title: "English", type: "string" },
                { name: "de", title: "German", type: "string" },
              ],
            },
            {
              name: "description",
              title: "Description",
              type: "object",
              fields: [
                { name: "en", title: "English", type: "text" },
                { name: "de", title: "German", type: "text" },
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
              titleEn: "title.en",
              titleDe: "title.de",
              media: "image",
            },
            prepare({ titleEn, titleDe, media }) {
              return {
                title: titleEn || titleDe || "Facility",
                media: media,
              };
            },
          },
        },
      ],
    }),

    // Performance Statistics
    defineField({
      name: "statistics",
      title: "Performance Statistics",
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
                  { title: "Users", value: "Users" },
                  { title: "Trophy", value: "Trophy" },
                  { title: "TrendingUp", value: "TrendingUp" },
                  { title: "Award", value: "Award" },
                ],
              },
            },
            {
              name: "label",
              title: "Label",
              type: "object",
              fields: [
                { name: "en", title: "English", type: "string" },
                { name: "de", title: "German", type: "string" },
              ],
            },
            {
              name: "value",
              title: "Value",
              type: "number",
            },
            {
              name: "suffix",
              title: "Suffix",
              type: "string",
              description: "e.g., '+', '%'",
              initialValue: "",
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
              labelEn: "label.en",
              labelDe: "label.de",
              value: "value",
              suffix: "suffix",
              iconType: "iconType",
            },
            prepare({ labelEn, labelDe, value, suffix, iconType }) {
              return {
                title: `${value}${suffix || ""} ${labelEn || labelDe || "Stat"}`,
                subtitle: `Icon: ${iconType || ""}`,
              };
            },
          },
        },
      ],
    }),

    // Player Development Roadmap
    defineField({
      name: "roadmap",
      title: "Player Development Roadmap",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Section Title",
          type: "object",
          fields: [
            { name: "en", title: "English", type: "string" },
            { name: "de", title: "German", type: "string" },
          ],
        },
        {
          name: "subtitle",
          title: "Section Subtitle",
          type: "object",
          fields: [
            { name: "en", title: "English", type: "string" },
            { name: "de", title: "German", type: "string" },
          ],
        },
        {
          name: "phases",
          title: "Phases",
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
                      { title: "Activity", value: "Activity" },
                      { title: "BarChart3", value: "BarChart3" },
                      { title: "GraduationCap", value: "GraduationCap" },
                    ],
                  },
                },
                {
                  name: "title",
                  title: "Title",
                  type: "object",
                  fields: [
                    { name: "en", title: "English", type: "string" },
                    { name: "de", title: "German", type: "string" },
                  ],
                },
                {
                  name: "description",
                  title: "Description",
                  type: "object",
                  fields: [
                    { name: "en", title: "English", type: "text" },
                    { name: "de", title: "German", type: "text" },
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
                  titleEn: "title.en",
                  titleDe: "title.de",
                  iconType: "iconType",
                },
                prepare({ titleEn, titleDe, iconType }) {
                  return {
                    title: titleEn || titleDe || "Phase",
                    subtitle: `Icon: ${iconType || ""}`,
                  };
                },
              },
            },
          ],
        },
      ],
    }),

    // Weekly Training Gallery
    defineField({
      name: "weeklyGallery",
      title: "Weekly Training Gallery",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
            },
            {
              name: "caption",
              title: "Caption",
              type: "object",
              fields: [
                { name: "en", title: "English", type: "string" },
                { name: "de", title: "German", type: "string" },
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
              captionEn: "caption.en",
              captionDe: "caption.de",
              media: "image",
            },
            prepare({ captionEn, captionDe, media }) {
              return {
                title: captionEn || captionDe || "Gallery Image",
                media: media,
              };
            },
          },
        },
      ],
    }),

    // Testimonials
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "name",
              title: "Name",
              type: "object",
              fields: [
                { name: "en", title: "English", type: "string" },
                { name: "de", title: "German", type: "string" },
              ],
            },
            {
              name: "role",
              title: "Role",
              type: "object",
              fields: [
                { name: "en", title: "English", type: "string" },
                { name: "de", title: "German", type: "string" },
              ],
            },
            {
              name: "quote",
              title: "Quote",
              type: "object",
              fields: [
                { name: "en", title: "English", type: "text" },
                { name: "de", title: "German", type: "text" },
              ],
            },
            {
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
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
              nameEn: "name.en",
              nameDe: "name.de",
              roleEn: "role.en",
              roleDe: "role.de",
              media: "image",
            },
            prepare({ nameEn, nameDe, roleEn, roleDe, media }) {
              return {
                title: nameEn || nameDe || "Testimonial",
                subtitle: roleEn || roleDe || "",
                media: media,
              };
            },
          },
        },
      ],
    }),

    // Trainers
    defineField({
      name: "trainers",
      title: "Trainers",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "trainer" }],
        },
      ],
      description: "Select trainers to display on the training page",
    }),

    // CTA Section
    defineField({
      name: "cta",
      title: "CTA Section",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Title",
          type: "object",
          fields: [
            { name: "en", title: "English", type: "string" },
            { name: "de", title: "German", type: "string" },
          ],
        },
        {
          name: "description",
          title: "Description",
          type: "object",
          fields: [
            { name: "en", title: "English", type: "text" },
            { name: "de", title: "German", type: "text" },
          ],
        },
        {
          name: "button1Text",
          title: "Button 1 Text",
          type: "object",
          fields: [
            { name: "en", title: "English", type: "string" },
            { name: "de", title: "German", type: "string" },
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
            { name: "en", title: "English", type: "string" },
            { name: "de", title: "German", type: "string" },
          ],
        },
        {
          name: "button2Link",
          title: "Button 2 Link",
          type: "string",
          initialValue: "/our-team",
        },
      ],
    }),
  ],
});
