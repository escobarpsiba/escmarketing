import { createFileRoute } from "@tanstack/react-router";
import acondeHtml from "@/content/aconte.html?raw";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aconte - Business Conference and Event Planning" },
      { name: "description", content: "Aconte: the premier business conference and event planning experience." },
      { property: "og:title", content: "Aconte - Business Conference and Event Planning" },
      { property: "og:description", content: "Aconte: the premier business conference and event planning experience." },
    ],
    links: [
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" },
      { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" },
    ],
  }),
  component: Index,
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  // Extract everything between <body> and </body> from the raw HTML file.
  const match = /<body[^>]*>([\s\S]*?)<\/body>/i.exec(acondeHtml);
  const body = match ? match[1] : acondeHtml;
  const styleMatch = /<style[^>]*>([\s\S]*?)<\/style>/i.exec(acondeHtml);
  const css = styleMatch ? styleMatch[1] : "";
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </>
  );
}
