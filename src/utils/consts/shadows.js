interface Shadow{
    shadowColor: string,
    shadowOffset: {
        width: number,
        height: number,
    },
    shadowOpacity: number,
    shadowRadius: number,

    elevation: number,
}

export const SHADOW_7: Shadow = {
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,

    elevation: 7,
};

export const SHADOW_5: Shadow = {
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.65,

    elevation: 5,
};

export const SHADOW_3: Shadow = {
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.22,

    elevation: 3,
};

export const SHADOW_2: Shadow = {
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1.41,

    elevation: 2,
};

export const SHADOW_1: Shadow = {
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 0.7,

    elevation: 1,
};

export const SHADOW_0: Shadow = {
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,

    elevation: 0,
};