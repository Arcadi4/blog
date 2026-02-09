import Link from 'next/link';

export default function Header() {
  return (
    <header className="hidden" aria-hidden="true">
      <div>
        <nav>
          <Link href="/">
            My Blog
          </Link>
          <div>
            <Link href="/">
              Home
            </Link>
            <Link href="/about">
              About
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
