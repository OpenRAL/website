import "./Footer.css";

function DocsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H17a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6.5A1.5 1.5 0 0 1 5 19.5v-15Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8.5 7.5h7M8.5 11h7M8.5 14.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.2-3.1-.12-.29-.52-1.46.11-3.05 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.82 0c2.22-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.76.11 3.05.75.81 1.2 1.84 1.2 3.1 0 4.43-2.69 5.41-5.25 5.69.42.36.8 1.08.8 2.18v3.23c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}
function HuggingFaceIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.2" fill="currentColor" opacity="0.18" />
      <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="9" cy="10.5" r="1.1" fill="currentColor" />
      <circle cx="15" cy="10.5" r="1.1" fill="currentColor" />
      <path d="M8.4 14c1 1.4 2.2 2 3.6 2s2.6-.6 3.6-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M19.5 5.2A17 17 0 0 0 15.3 4l-.2.4a13 13 0 0 1 3.7 1.2 13.6 13.6 0 0 0-11.6 0A13 13 0 0 1 10.9 4.4L10.7 4a17 17 0 0 0-4.2 1.2C3.7 9.3 3 13.3 3.3 17.2a17 17 0 0 0 5.1 2.6l.6-1c-.6-.2-1.1-.5-1.6-.8l.4-.3a9.7 9.7 0 0 0 8.4 0l.4.3c-.5.3-1 .6-1.6.8l.6 1a17 17 0 0 0 5.1-2.6c.4-4.5-.6-8.5-2.8-12ZM9.5 14.7c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8Zm5 0c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8Z" />
    </svg>
  );
}

const SOCIAL = [
  { href: "https://docs.openral.com", label: "Documentation", icon: DocsIcon },
  { href: "https://github.com/OpenRAL/openral", label: "GitHub", icon: GitHubIcon },
  { href: "https://huggingface.co/OpenRAL", label: "Hugging Face", icon: HuggingFaceIcon },
  { href: "https://discord.gg/3paXT2bVyB", label: "Discord", icon: DiscordIcon },
];

const NAV = [
  { href: "/#install", label: "Install" },
  { href: "/#architecture", label: "Architecture" },
  { href: "/#features", label: "Capabilities" },
  { href: "/#rskills", label: "rSkills" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <a className="brand" href="#top">
            <img className="brand-mark" src="/assets/icon.svg" alt="" aria-hidden="true" />
            <span className="brand-name">OpenRAL</span>
          </a>
          <p>The open harness for physical AI — one typed contract and one safety boundary across every robot and rSkill.</p>
          <div className="footer-social">
            {SOCIAL.map(({ href, label, icon: Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener" aria-label={label} title={label}>
                <Icon />
              </a>
            ))}
          </div>
          <p className="footer-copy">© 2026 OpenRAL</p>
        </div>

        <div className="footer-col">
          <h4>Explore</h4>
          {NAV.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>

        <div className="footer-col">
          <h4>Resources</h4>
          <a href="https://docs.openral.com" target="_blank" rel="noopener">Documentation</a>
          <a href="https://huggingface.co/OpenRAL/models" target="_blank" rel="noopener">Browse rSkills</a>
          <a href="https://www.apache.org/licenses/LICENSE-2.0" target="_blank" rel="noopener">License</a>
          <a href="/privacy">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
