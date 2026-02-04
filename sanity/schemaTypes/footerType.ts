import { defineType, defineField } from "sanity";

export const footerType = defineType({
  name: "footer",
  title: "Footer",
  type: "document",
  
  // Singleton pattern - only one footer document allowed
  __experimental_actions: [
    // "create",
    "update",
    // "delete",
    "publish",
  ],
  
  preview: {
    select: {
      clubName: "clubName",
    },
    prepare({ clubName }) {
      return {
        title: "Footer Settings",
        subtitle: clubName || "No club name set",
      };
    },
  },

  fields: [
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      description: "Club logo displayed in the footer",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Alternative text for the logo",
        },
      ],
    }),

    defineField({
      name: "clubName",
      title: "Club Name",
      type: "string",
      description: "Name of the club",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "Brief description about the club",
      rows: 3,
    }),

    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
      description: "Contact email displayed in footer",
      validation: (Rule) => Rule.email(),
    }),

    defineField({
      name: "clubLinks",
      title: "Club Links",
      type: "array",
      description: "Navigation links for club-related pages",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "url",
              title: "URL",
              type: "string",
              description: "Relative URL (e.g., /about) or absolute URL",
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: "title",
              url: "url",
            },
            prepare({ title, url }) {
              return {
                title: title || "Untitled",
                subtitle: url || "No URL",
              };
            },
          },
        },
      ],
    }),

    defineField({
      name: "supportLinks",
      title: "Support Links",
      type: "array",
      description: "Navigation links for support-related pages",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "url",
              title: "URL",
              type: "string",
              description: "Relative URL (e.g., /contact) or absolute URL",
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: "title",
              url: "url",
            },
            prepare({ title, url }) {
              return {
                title: title || "Untitled",
                subtitle: url || "No URL",
              };
            },
          },
        },
      ],
    }),

    defineField({
      name: "legalLinks",
      title: "Legal Links",
      type: "array",
      description: "Navigation links for legal pages",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "url",
              title: "URL",
              type: "string",
              description: "Relative URL (e.g., /privacy) or absolute URL",
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: "title",
              url: "url",
            },
            prepare({ title, url }) {
              return {
                title: title || "Untitled",
                subtitle: url || "No URL",
              };
            },
          },
        },
      ],
    }),

    defineField({
      name: "socialLinks",
      title: "Social Media Links",
      type: "array",
      description: "Social media profile links",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "Facebook", value: "Facebook" },
                  { title: "Instagram", value: "Instagram" },
                  { title: "Twitter", value: "Twitter" },
                  { title: "YouTube", value: "YouTube" },
                ],
                layout: "radio",
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: "url",
              title: "URL",
              type: "url",
              description: "Full URL to the social media profile",
              validation: (Rule) => Rule.required().uri({
                scheme: ["http", "https"],
              }),
            },
          ],
          preview: {
            select: {
              platform: "platform",
              url: "url",
            },
            prepare({ platform, url }) {
              return {
                title: platform || "Social Link",
                subtitle: url || "No URL",
              };
            },
          },
        },
      ],
    }),

    defineField({
      name: "copyrightText",
      title: "Copyright Text",
      type: "string",
      description: "Copyright text displayed at the bottom of the footer",
      placeholder: "All rights reserved.",
    }),
  ],
});
