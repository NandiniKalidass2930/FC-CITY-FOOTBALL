import { defineType, defineField } from "sanity";

export const faqType = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  
  preview: {
    select: {
      questionEn: "question.en",
      questionDe: "question.de",
      icon: "icon",
      order: "order",
    },
    prepare({ questionEn, questionDe, icon, order }) {
      const title = questionEn || questionDe || "Untitled FAQ";
      const subtitle = `${icon || "Info"}${order !== undefined ? ` • Order: ${order}` : ""}`;
      return {
        title: title,
        subtitle: subtitle,
      };
    },
  },

  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "object",
      fields: [
        {
          name: "en",
          title: "English",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "de",
          title: "German",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "answer",
      title: "Answer",
      type: "object",
      fields: [
        {
          name: "en",
          title: "English",
          type: "text",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "de",
          title: "German",
          type: "text",
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      description: "Icon to display with this FAQ",
      options: {
        list: [
          { title: "Info", value: "Info" },
          { title: "Trophy", value: "Trophy" },
          { title: "Users", value: "Users" },
          { title: "Heart", value: "Heart" },
        ],
      },
      initialValue: "Info",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first. Used for sorting FAQs.",
      initialValue: 0,
      validation: (Rule) => Rule.required().min(0),
    }),
  ],
});
