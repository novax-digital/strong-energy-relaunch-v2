export type BlogEditorSection = {
  id: string;
  heading: string;
  body: string;
};

export type BlogEditorContent = {
  intro: string;
  sections: BlogEditorSection[];
};

function sectionId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createBlogEditorSection(heading = "", body = ""): BlogEditorSection {
  return { id: sectionId(), heading, body };
}

export function createEmptyBlogEditorContent(language = "de"): BlogEditorContent {
  return {
    intro: "",
    sections: [
      createBlogEditorSection(language === "en" ? "Key points at a glance" : "Das Wichtigste auf einen Blick"),
      createBlogEditorSection(),
      createBlogEditorSection(language === "en" ? "Conclusion" : "Fazit")
    ]
  };
}

export function parseBlogContent(content: string, language = "de"): BlogEditorContent {
  const normalized = content.replace(/\r\n/g, "\n").trim();
  if (!normalized) return createEmptyBlogEditorContent(language);

  const lines = normalized.split("\n");
  const introLines: string[] = [];
  const sections: BlogEditorSection[] = [];
  let currentSection: BlogEditorSection | null = null;

  for (const line of lines) {
    const heading = line.match(/^##\s+(.+)$/);
    if (heading) {
      if (currentSection) {
        currentSection.body = currentSection.body.trim();
        sections.push(currentSection);
      }
      currentSection = createBlogEditorSection(heading[1].trim());
      continue;
    }

    if (currentSection) currentSection.body += `${currentSection.body ? "\n" : ""}${line}`;
    else introLines.push(line);
  }

  if (currentSection) {
    currentSection.body = currentSection.body.trim();
    sections.push(currentSection);
  }

  return {
    intro: introLines.join("\n").trim(),
    sections: sections.length ? sections : [createBlogEditorSection()]
  };
}

export function serializeBlogContent(content: BlogEditorContent) {
  const parts: string[] = [];
  if (content.intro.trim()) parts.push(content.intro.trim());

  for (const section of content.sections) {
    const heading = section.heading.trim();
    const body = section.body.trim();
    if (!heading && !body) continue;
    if (heading) parts.push(`## ${heading}${body ? `\n\n${body}` : ""}`);
    else parts.push(body);
  }

  return parts.join("\n\n").trim();
}

export function blogWordCount(content: string) {
  return content
    .replace(/[#*_>`\[\]()!-]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}
