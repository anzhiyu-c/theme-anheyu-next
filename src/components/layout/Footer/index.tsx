"use client";

import Link from "next/link";
import { Github, Twitter, Mail, Heart } from "lucide-react";

const socialLinks = [
  { name: "GitHub", href: "https://github.com/anzhiyu-c", icon: Github },
  { name: "Twitter", href: "https://twitter.com", icon: Twitter },
  { name: "Email", href: "mailto:contact@anheyu.com", icon: Mail },
];

const footerLinks = [
  {
    title: "导航",
    links: [
      { name: "首页", href: "/" },
      { name: "文章", href: "/posts" },
      { name: "分类", href: "/categories" },
      { name: "标签", href: "/tags" },
    ],
  },
  {
    title: "关于",
    links: [
      { name: "关于我", href: "/about" },
      { name: "友情链接", href: "/links" },
      { name: "留言板", href: "/guestbook" },
    ],
  },
  {
    title: "其他",
    links: [
      { name: "RSS", href: "/rss.xml" },
      { name: "站点地图", href: "/sitemap.xml" },
    ],
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const startYear = 2020;

  return (
    <footer id="footer-container" className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* 品牌区域 */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-2xl font-bold text-primary">
              AnHeYu
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">分享技术与生活，记录成长的点滴。</p>
            {/* 社交链接 */}
            <div className="flex space-x-4 mt-6">
              {socialLinks.map(link => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={link.name}
                >
                  <link.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* 链接区域 */}
          {footerLinks.map(section => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-foreground mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map(link => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 底部版权信息 */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {startYear} - {currentYear} AnHeYu. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground flex items-center">
              Made with <Heart className="w-4 h-4 mx-1 text-destructive fill-current" /> using Next.js & HeroUI
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
