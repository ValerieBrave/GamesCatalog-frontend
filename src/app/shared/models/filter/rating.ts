export enum PEGIRating {
    Three = 1,
    Seven,
    Twelve,
    Sixteen,
    Eighteen,
    RP,
    EC,
    E,
    E10,
    T,
    M,
    AO
}

export function getRatingStringValue(r): string {
    switch(r) {
        case PEGIRating.Three: return '3'
        case PEGIRating.Seven: return '7'
        case PEGIRating.Twelve: return '12'
        case PEGIRating.Sixteen: return '16'
        case PEGIRating.Eighteen: return '18'
        case PEGIRating.RP: return 'RP'
        case PEGIRating.EC: return 'EC'
        case PEGIRating.E: return 'E'
        case PEGIRating.E10: return 'E10'
        case PEGIRating.T: return 'T'
        case PEGIRating.M: return 'M'
        case PEGIRating.AO: return 'AO'
    }
}

export function getRatingNumber(r): number {
    switch(r) {
        case '3': return PEGIRating.Three
        case '7': return PEGIRating.Seven
        case '12': return PEGIRating.Twelve
        case '16': return PEGIRating.Sixteen
        case '18': return PEGIRating.Eighteen
        case 'RP': return PEGIRating.RP
        case 'EC': return PEGIRating.EC
        case 'E': return PEGIRating.E
        case 'E10': return PEGIRating.E10
        case 'T': return PEGIRating.T
        case 'M': return PEGIRating.M
        case 'AO': return PEGIRating.AO
    }
}
