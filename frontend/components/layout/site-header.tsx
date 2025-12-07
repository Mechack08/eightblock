import Link from 'next/link';
import Image from 'next/image';
import SearchComponent from '../search/Search';
import { Hero } from '../hero';

export function SiteHeader() {
  return (
    <header className="bg-white/80 backdrop-blur pt-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-primary">
          <Image src="/logo.svg" alt="eightblock logo" width={150} height={40} priority />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <SearchComponent />
        </nav>
      </div>

      <Hero />
    </header>
  );
}
