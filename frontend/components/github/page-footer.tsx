import Link from 'next/link';

interface FooterLink {
  href: string;
  label: string;
}

interface PageFooterProps {
  links?: FooterLink[];
}

const defaultLinks: FooterLink[] = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/contributors', label: 'Contributors' },
  { href: '/github', label: 'GitHub Repository' },
];

export const PageFooter = ({ links = defaultLinks }: PageFooterProps) => {
  return (
    <div className="mt-12 pt-8 border-t border-border">
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="hover:text-foreground transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
};
