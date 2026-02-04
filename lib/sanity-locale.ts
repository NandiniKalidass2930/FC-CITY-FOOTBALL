/**
 * Helper function to get localized content from Sanity fields
 * Returns the value for the current language, falling back to English if not available
 */
export function getLocalizedContent<T extends { en?: string; de?: string } | string | undefined>(
  field: T,
  lang: "en" | "de"
): string {
  if (!field) return ""
  
  // If field is already a string (backward compatibility)
  if (typeof field === "string") {
    return field
  }
  
  // If field is an object with language keys
  if (typeof field === "object" && field !== null) {
    const localizedField = field as { en?: string; de?: string }
    return localizedField[lang] || localizedField.en || ""
  }
  
  return ""
}

/**
 * Helper function to get localized text content (for longer text fields)
 */
export function getLocalizedText<T extends { en?: string; de?: string } | string | undefined>(
  field: T,
  lang: "en" | "de"
): string {
  return getLocalizedContent(field, lang)
}
