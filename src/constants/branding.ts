export const DEALERSHIP_BRANDING = {
    PAPE: {
        name: 'Papé',
        color: '#FFDE00', // Yellow
        id: 'pape',
    },
    NEW_HOLLAND: {
        name: 'New Holland',
        color: '#0057B8', // Blue
        id: 'new-holland',
    },
    CASE_IH: {
        name: 'Case IH',
        color: '#D80000', // Red
        id: 'case-ih',
    },
    KUBOTA: {
        name: 'Kubota',
        color: '#F39200', // Orange
        id: 'kubota',
    },
    KIOTI: {
        name: 'Kioti',
        color: '#D94E27', // Deep Orange / Red-Orange (Distinct from Kubota)
        id: 'kioti',
    },
} as const;

export type DealershipType = keyof typeof DEALERSHIP_BRANDING;
