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

export function getRatingStringValue(r): String {
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
