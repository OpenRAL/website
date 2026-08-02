import { DocsIcon, GitHubIcon, HuggingFaceIcon, DiscordIcon } from "./icons.jsx";
import "./Footer.css";

const SOCIAL = [
  { href: "https://docs.openral.com", label: "Documentation", icon: DocsIcon },
  { href: "https://github.com/OpenRAL/openral", label: "GitHub", icon: GitHubIcon },
  { href: "https://huggingface.co/OpenRAL", label: "Hugging Face", icon: HuggingFaceIcon },
  { href: "https://discord.gg/3paXT2bVyB", label: "Discord", icon: DiscordIcon },
];

const NAV = [
  { href: "/#architecture", label: "Harness" },
  { href: "/#install", label: "Install" },
  { href: "/pipeline", label: "Pipeline" },
  { href: "/#contact", label: "Contact" },
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
