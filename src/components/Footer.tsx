import Link from "@/components/Link";

export default function Footer() {
  return (
    <footer className="mt-auto py-4 text-center text-sm font-mono bg-klein text-white">
      <p>
        &copy; {new Date().getFullYear()} 4rcadia.
        <br />
        All articles and web design licensed under CC BY-NC 4.0 if not otherwise
        specified.
        <br />
        Source code distributed with MIT License at{" "}
        <Link href="https://github.com/Arcadi4/blog" />
      </p>
    </footer>
  );
}
