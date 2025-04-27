export const toc = [
    {
        label: 'Introduction',
        items: [
            // Each item here is one entry in the navigation menu.
            { slug: 'guides/intro' },
            { label: 'Example Guide', slug: 'guides/example' }
        ],
    },
    {
        label: 'Reference',
        autogenerate: { directory: 'reference' },
    }
]