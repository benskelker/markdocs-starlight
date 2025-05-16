/**
 * @param {string} variant
 * @returns {import('@astrojs/starlight').SidebarItem[]}
 */
export function generateToc(variant) {
  console.log('toc - variant passed:', variant);

  return [
    {
      label: 'Get started',
      items: [
        {
          label: 'Get started',
          items: [
            ...(variant === 'ent'
              ? [
                  'sca/sca_overview-sca',
                  'sca/sca-support',
                  'sca/sca-terminology',
                  'cv/cv-terminology',
                ]
              : []),
            ...(variant === 'oss'
              ? [
                  'cv/intro',
                  'cv/cv-terminology',
                  'sca/sca-terminology',
                ]
              : []),
          ],
        },
      ],
    },
    {
      label: 'APIs',
      items: [
        {
          label: 'APIs',
          items: [
            {
              label: 'Workspace Ops API',
              link: 'apis/workspace-ops',
            },
          ],
        },
      ],
    },
  ];
}
