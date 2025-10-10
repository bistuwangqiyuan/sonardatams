import React from 'react';
import type { FC } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * 面包屑导航组件
 * @description 提供页面层级导航，增强用户体验和SEO
 */
export const Breadcrumb: FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol
        itemScope
        itemType="https://schema.org/BreadcrumbList"
        className="flex flex-wrap items-center gap-2 text-sm text-gray-400"
      >
        {items.map((item, index) => (
          <li
            key={index}
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            className="flex items-center"
          >
            {item.href ? (
              <>
                <a
                  itemProp="item"
                  href={item.href}
                  className="hover:text-secondary transition-colors"
                >
                  <span itemProp="name">{item.label}</span>
                </a>
                <meta itemProp="position" content={String(index + 1)} />
                {index < items.length - 1 && (
                  <span className="mx-2 text-gray-600">/</span>
                )}
              </>
            ) : (
              <>
                <span
                  itemProp="name"
                  className="text-white font-medium"
                >
                  {item.label}
                </span>
                <meta itemProp="position" content={String(index + 1)} />
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
